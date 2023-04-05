/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

export default {
  retail: {
    createBQMLModel: `CREATE OR REPLACE MODEL \`my_retail_dataset.forecast_model\`
    OPTIONS
    (MODEL_TYPE = 'ARIMA_PLUS',
    TIME_SERIES_TIMESTAMP_COL = 'date',
    TIME_SERIES_DATA_COL = 'sales',
    TIME_SERIES_ID_COL = 'product_at_store',
    HORIZON = 240
    ) AS
    SELECT
    date,
    sales,
    product_at_store
    FROM
    \`my_retail_dataset.sales_table\`;`,
  },
};
