import abc
import models
from typing import Dict, Generic, List, Optional, TypeVar

T = TypeVar("T")


class DatasetService(abc.ABC, Generic[T]):
    @abc.abstractmethod
    def get_all(self) -> List[T]:
        pass

    @abc.abstractmethod
    def get_by_id(self, id: str) -> Optional[T]:
        pass


class ImageDatasetService(DatasetService[models.Image]):
    def __init__(self) -> None:
        self.images: List[models.Image] = []  # TODO
        self.images_map: Dict[str, models.Image] = {
            image.id: image for image in self.images
        }

    def get_all(self) -> List[models.Image]:
        return self.images

    def get_by_id(self, id: str) -> Optional[models.Image]:
        return self.images_map.get(id)


class TextDatasetService(DatasetService[str]):
    def __init__(self, words_file: str) -> None:

        with open(words_file, "r") as f:
            self.words = f.readlines()

    def get_all(self) -> List[str]:
        return self.words

    def get_by_id(self, id: str) -> Optional[str]:
        return id
