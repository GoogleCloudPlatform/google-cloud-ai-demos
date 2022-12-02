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

import { ExplanationFlowStep, TabbedFlow } from 'common/components/TabbedFlow';
import * as React from 'react';

import { DatasetStep } from './DatasetStep';
import { EmbeddingStep } from './EmbeddingStep';
import { MoreInfo, MoreInfoStep } from './MoreInfoStep';
import { MotivationStep } from './MotivationStep';

const steps: ExplanationFlowStep[] = [
  {
    name: 'Motivation',
    node: <MotivationStep key={0} />,
  },
  {
    name: 'Data',
    node: <DatasetStep key={1} />,
  },
  {
    name: 'Data Preparation',
    node: <EmbeddingStep key={2} />,
  },
  {
    name: 'More Info',
    node: <MoreInfoStep key={6} />,
    info: MoreInfo,
  },
];

export default () => <TabbedFlow steps={steps} />;
