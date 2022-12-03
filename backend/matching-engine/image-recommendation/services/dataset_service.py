import models
from typing import List, Optional

class DatasetService:
    def __init__(self) -> None:
        self.images = [] # TODO
        self.images_map = {image.id for image in self.images}

    def get_images(self) -> List[models.Image]:
        return self.images

    def get_image_by_id(self, id: str) -> Optional[models.Image]:
        return self.images_map.get(id)