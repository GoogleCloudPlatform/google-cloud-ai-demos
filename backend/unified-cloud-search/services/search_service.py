# Copyright 2023 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

import abc
import dataclasses
import logging
from typing import Any, Dict, Generic, List, Optional, Tuple, TypeVar

import tracer_helper

T = TypeVar("T")

logger = logging.getLogger(__name__)
tracer = tracer_helper.get_tracer(__name__)


@dataclasses.dataclass
class SearchResult:
    distance: float
    title: Optional[str] = None
    description: Optional[str] = None
    url: Optional[str] = None
    image: Optional[str] = None


@dataclasses.dataclass
class Item:
    text: str
    id: Optional[str]
    image: Optional[str]


@dataclasses.dataclass
class CodeInfo:
    url: str
    title: str


class SearchService(abc.ABC, Generic[T]):
    @abc.abstractproperty
    def id(self) -> str:
        """Unique identifier for this service."""
        pass

    @abc.abstractproperty
    def name(self) -> str:
        """Name for this service that is shown on the frontend."""
        pass

    @abc.abstractproperty
    def description(self) -> str:
        """Description for this service that is shown on the frontend."""
        pass

    @property
    def allows_text_input(self) -> bool:
        """If true, this service allows text input."""
        return False

    @property
    def code_info(self) -> Optional[CodeInfo]:
        """Info about code used to generate index."""
        return None

    @abc.abstractmethod
    def get_suggestions(self, num_items: int = 60) -> List[Item]:
        """Get all existing ids and items."""
        pass

    @abc.abstractmethod
    def get_by_id(self, id: str) -> Optional[T]:
        """Get an item by id."""
        pass

    @abc.abstractmethod
    def get_total_index_count(self) -> int:
        """Get total index count."""
        pass

    @abc.abstractmethod
    def search(self, query: str, num_neighbors: int) -> List[SearchResult]:
        pass
