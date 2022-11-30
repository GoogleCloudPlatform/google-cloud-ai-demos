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

# Each forecast prediction must output a BigQuery destination table with the following columns
FORECAST_TIME_SERIES_IDENTIFIER_COLUMN = "time_series_identifier"
FORECAST_TIME_COLUMN = "time"
FORECAST_TARGET_COLUMN = "target"
FORECAST_TARGET_COLUMN_LOWER_BOUND = "target_column_lower_bound"
FORECAST_TARGET_COLUMN_UPPER_BOUND = "target_column_upper_bound"
