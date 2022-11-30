# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import abc
import dataclasses
from concurrent import futures
from datetime import datetime
from typing import Any, Awaitable, Dict, List, Optional, Tuple, Union

import pandas as pd
from google.cloud import bigquery

from models import completed_forecast_job, forecast_job_request
from services import forecast_job_service


class ForecastJobCoordinator(abc.ABC):
    """
    Coordinates the queue of jobs, listing pending jobs and getting results.
    A forecast job is defined as a pipeline involved training a model, getting evaluations and getting a prediction.
    """

    @abc.abstractmethod
    def enqueue_job(self, request: forecast_job_request.ForecastJobRequest) -> str:
        """Enqueue the request to a job queue for later processing.

        Args:
            request (TrainingJobManagerRequest): The job request.

        Returns:
            str: The job id
        """
        pass

    @abc.abstractmethod
    def list_pending_jobs(self) -> List[forecast_job_request.ForecastJobRequest]:
        """List pending jobs.

        Returns:
            List[ForecastJobRequest]: The pending jobs.
        """
        # TODO: Add pagination
        pass

    @abc.abstractmethod
    def get_completed_job(
        self, job_id: str
    ) -> Optional[completed_forecast_job.CompletedForecastJob]:
        """Get completed job by job_id.

        Returns:
            completed_forecast_job.ForecastJobResult: The job.
        """
        pass

    def list_completed_jobs(self) -> List[completed_forecast_job.CompletedForecastJob]:
        """List completed jobs.

        Returns:
            List[completed_forecast_job.CompletedForecastJob]: The completed results.
        """
        pass

    @abc.abstractmethod
    def get_request(
        self, job_id: str
    ) -> Optional[forecast_job_request.ForecastJobRequest]:
        """Get the request for a given job_id.

        Args:
            job_id (str): Job id.

        Returns:
            Optional[forecast_job_request.ForecastJobRequest]: The request.
        """
        pass

    @abc.abstractmethod
    def get_evaluation(self, job_id: str) -> Optional[pd.DataFrame]:
        """Get the evaluation dataframe for a given job_id.

        Args:
            job_id (str): Job id.

        Returns:
            Optional[pd.DataFrame]: The evaluation dataframe.
        """
        pass

    @abc.abstractmethod
    def get_prediction(self, job_id: str) -> Optional[pd.DataFrame]:
        """Get the prediction dataframe for a given job_id.

        Args:
            job_id (str): Job id.

        Returns:
            Optional[pd.DataFrame]: The prediction dataframe.
        """
        pass


class MemoryTrainingJobCoordinator(ForecastJobCoordinator):
    """
    A job manager to queue jobs and delegate jobs to workers.

    Primarily used for development and testing.
    However, may be used in production if session affinity (https://cloud.google.com/run/docs/configuring/session-affinity) is enabled.
    """

    def __init__(
        self, forecast_job_service: forecast_job_service.ForecastJobService
    ) -> None:
        """Initializes the manager.

        Args:
            training_service (training_service.TrainingJobService): The service used by each worker to run the training job.
        """
        super().__init__()
        self._forecast_job_service = forecast_job_service
        self._thread_pool_executor = futures.ThreadPoolExecutor()
        self._pending_jobs: Dict[str, completed_forecast_job.ForecastJobRequest] = {}
        self._completed_jobs: Dict[
            str, completed_forecast_job.CompletedForecastJob
        ] = {}
        self._evaluation_uri_map: Dict[str, str] = {}
        self._prediction_uri_map: Dict[str, str] = {}

    def _process_request(
        self, request: forecast_job_request.ForecastJobRequest
    ) -> Tuple[str, completed_forecast_job.CompletedForecastJob]:
        """Process the training jobs request.

        Args:
            request (TrainingJobManagerRequest): The request

        Returns:
            Tuple[str, forecast_job_result.ForecastJobResult]: The job id and result.
        """
        result = self._forecast_job_service.run(request=request)

        return request.id, result

    def _append_completed_result(self, future: futures.Future):
        """Append the result to a cache. Used as a Future callback.

        Args:
            future (futures.Future): The future that will return the TrainingResult.
        """
        output: Tuple[
            str, completed_forecast_job.CompletedForecastJob
        ] = future.result()

        # Deconstruct
        job_id, result = output

        if result:
            # Clear pending job
            del self._pending_jobs[job_id]

            # Append completed training results
            self._completed_jobs[job_id] = result

    def enqueue_job(self, request: forecast_job_request.ForecastJobRequest) -> str:
        """Enqueue the request to a job queue for later processing.

        Args:
            request (TrainingJobManagerRequest): The job request.

        Returns:
            str: The job id
        """
        self._pending_jobs[request.id] = request

        future = self._thread_pool_executor.submit(self._process_request, request)
        future.add_done_callback(self._append_completed_result)

        return request.id

    def list_pending_jobs(self) -> List[forecast_job_request.ForecastJobRequest]:
        """List pending jobs.

        Returns:
            List[ForecastJobRequest]: The pending jobs.
        """
        return list(self._pending_jobs.values())

    def list_completed_jobs(self) -> List[completed_forecast_job.CompletedForecastJob]:
        """List completed jobs.

        Returns:
            List[forecast_job_result.ForecastJobResult]: The completed results.
        """
        return list(self._completed_jobs.values())

    def _get_bigquery_table_as_df(self, table_id: str) -> pd.DataFrame:
        client = bigquery.Client()
        query = f"""
            SELECT *
            FROM `{table_id}`
        """

        query_job = client.query(
            query=query,
        )

        df = query_job.to_dataframe()
        return df

    def get_request(
        self, job_id: str
    ) -> Optional[forecast_job_request.ForecastJobRequest]:
        """Get the request for a given job_id.

        Args:
            job_id (str): Job id.

        Returns:
            Optional[forecast_job_request.ForecastJobRequest]: The request.
        """
        pending_job_request: forecast_job_request.ForecastJobRequest = (
            self._pending_jobs.get(job_id)
        )

        if pending_job_request is not None:
            return pending_job_request
        else:
            completed_job: completed_forecast_job.CompletedForecastJob = (
                self._completed_jobs.get(job_id)
            )
            if completed_job is not None:
                return completed_job.request

        return None

    def get_completed_job(
        self, job_id: str
    ) -> Optional[completed_forecast_job.CompletedForecastJob]:
        """Get completed job by job_id.

        Returns:
            completed_forecast_job.ForecastJobResult: The job.
        """
        return self._completed_jobs.get(job_id)

    def get_evaluation(self, job_id: str) -> Optional[pd.DataFrame]:
        """Get the evaluation dataframe for a given job_id.

        Args:
            job_id (str): Job id.

        Returns:
            Optional[pd.DataFrame]: The evaluation dataframe.
        """
        job = self._completed_jobs.get(job_id)

        if job is None:
            return None

        table_id = job.evaluation_uri
        return self._get_bigquery_table_as_df(table_id=table_id) if table_id else None

    def get_prediction(self, job_id: str) -> Optional[pd.DataFrame]:
        """Get the prediction dataframe for a given job_id.

        Args:
            job_id (str): Job id.

        Returns:
            Optional[pd.DataFrame]: The prediction dataframe.
        """
        job = self._completed_jobs.get(job_id)

        if job is None:
            return None

        table_id = job.prediction_uri
        return self._get_bigquery_table_as_df(table_id=table_id) if table_id else None
