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
from datetime import datetime
from functools import cached_property, cache
from io import StringIO
from typing import Any, Dict, List, Optional, Union

import pandas as pd
from google.cloud import bigquery

import utils


class Dataset(abc.ABC):
    id: str
    description: str
    display_name: str
    time_column: str
    icon: Optional[str]
    recommended_model_parameters: Optional[Dict[str, Dict[str, Any]]]
    recommended_prediction_parameters: Optional[Dict[str, Dict[str, Any]]]
    train_percentage: int = 0.8

    @property
    @abc.abstractmethod
    def df(self) -> pd.DataFrame:
        """The full dataset dataframe, which can be quite large.

        Returns:
            pd.DataFrame: The dataset represented as a Pandas dataframe.
        """
        pass

    @cached_property
    def columns(self) -> List[str]:
        return self.df.columns.tolist()

    @cached_property
    def df_preview(self) -> pd.DataFrame:
        return self.df.head()

    @cached_property
    def start_date(self) -> datetime:
        df = self.df
        time_values = pd.to_datetime(df[self.time_column])

        return time_values.min()

    @cached_property
    def end_date(self) -> datetime:
        df = self.df
        time_values = pd.to_datetime(df[self.time_column])

        return time_values.max()

    @cached_property
    def date_cutoff(self) -> datetime:
        # The cut-off date for dataset train/test split
        df = self.df
        dates_unique = df[self.time_column].unique()
        date_cutoff = sorted(dates_unique)[
            round(len(dates_unique) * self.train_percentage)
        ]

        return date_cutoff

    @cached_property
    def df_train(self) -> pd.DataFrame:
        df = self.df

        # Split dataset based on date cut-off
        df_train = df[df[self.time_column] <= self.date_cutoff]

        return df_train

    @cached_property
    def df_test(self) -> pd.DataFrame:
        df = self.df

        # Split dataset based on date cut-off
        df_test = df[df[self.time_column] > self.date_cutoff]

        return df_test

    def as_response(self) -> Dict:
        df_preview = self.df_preview.fillna("").sort_values(self.time_column)
        df_preview["id"] = df_preview.index

        return {
            "id": self.id,
            "displayName": self.display_name,
            "description": self.description,
            "icon": self.icon,
            "startDate": self.start_date.strftime("%m/%d/%Y"),
            "endDate": self.end_date.strftime("%m/%d/%Y"),
            "columns": self.columns,
            "dfPreview": df_preview.to_dict("records"),
            "recommendedModelParameters": self.recommended_model_parameters,
            "recommendedPredictionParameters": self.recommended_prediction_parameters,
        }

    # @cache
    def get_bigquery_table_id(
        self, time_column: str, dataset_portion: Optional[str] = None
    ) -> str:
        """This function saves the dataset on BigQuery and returns the BigQuery
            bigquery distenation table uri.

        Args:
            time_column (str): Dataset time column name
            dataset_portion (str): `test` or `train`. This will return the
              main dataset (before split) if the data portion is None.

        Returns:
            str: BigQuery destination table ID.
        """

        dataset_id = utils.generate_uuid()
        table_id = utils.generate_uuid()

        # Write dataset to BigQuery table
        client = bigquery.Client()
        project_id = client.project

        bq_dataset = bigquery.Dataset(f"{project_id}.{dataset_id}")
        bq_dataset = client.create_dataset(bq_dataset, exists_ok=True)

        job_config = bigquery.LoadJobConfig(
            # Specify a (partial) schema. All columns are always written to the
            # table. The schema is used to assist in data type definitions.
            schema=[
                bigquery.SchemaField(time_column, bigquery.enums.SqlTypeNames.DATE),
            ],
            # Optionally, set the write disposition. BigQuery appends loaded rows
            # to an existing table by default, but with WRITE_TRUNCATE write
            # disposition it replaces the table with the loaded data.
            write_disposition="WRITE_TRUNCATE",
        )

        # Reference: https://cloud.google.com/bigquery/docs/samples/bigquery-load-table-dataframe
        df = pd.DataFrame()
        if dataset_portion == "train":
            df = self.df_train
        elif dataset_portion == "test":
            df = self.df_test
        elif dataset_portion is None:
            df = self.df
        else:
            raise ValueError(f"Unknown dataset portion: {dataset_portion}")

        job = client.load_table_from_dataframe(
            dataframe=df,
            destination=f"{project_id}.{dataset_id}.{table_id}",
            job_config=job_config,
        )  # Make an API request.

        _ = job.result()  # Wait for the job to complete.

        return str(job.destination)


@dataclasses.dataclass
class CSVDataset(Dataset):
    filepath_or_buffer: Union[str, StringIO]
    display_name: str
    time_column: str
    description: str
    icon: Optional[str] = None
    recommended_model_parameters: Optional[Dict[str, Dict[str, Any]]] = None
    recommended_prediction_parameters: Optional[Dict[str, Dict[str, Any]]] = None
    id: str = dataclasses.field(default_factory=utils.generate_uuid)

    @cached_property
    def df(self) -> pd.DataFrame:
        df = pd.read_csv(self.filepath_or_buffer)
        df[self.time_column] = pd.to_datetime(df[self.time_column], utc=True)
        return df.sort_values(self.time_column)


@dataclasses.dataclass
class VertexAIDataset(Dataset):
    id: str
    display_name: str
    time_column: str
    description: str
    project: str
    region: str
    icon: Optional[str] = None
    recommended_model_parameters: Optional[Dict[str, Dict[str, Any]]] = None
    recommended_prediction_parameters: Optional[Dict[str, Dict[str, Any]]] = None

    @cached_property
    def df(self) -> pd.DataFrame:
        # TODO: Pull dataframe from Vertex AI Dataset
        return pd.DataFrame()
