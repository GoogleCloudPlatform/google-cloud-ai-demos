from pathlib import Path
from typing import Optional, Tuple

from google.cloud import storage
import os


def extract_bucket_and_prefix_from_gcs_path(gcs_path: str) -> Tuple[str, Optional[str]]:
    """Given a complete GCS path, return the bucket name and prefix as a tuple.

    Example Usage:

        bucket, prefix = extract_bucket_and_prefix_from_gcs_path(
            "gs://example-bucket/path/to/folder"
        )

        # bucket = "example-bucket"
        # prefix = "path/to/folder"

    Args:
        gcs_path (str):
            Required. A full path to a Google Cloud Storage folder or resource.
            Can optionally include "gs://" prefix or end in a trailing slash "/".

    Returns:
        Tuple[str, Optional[str]]
            A (bucket, prefix) pair from provided GCS path. If a prefix is not
            present, a None will be returned in its place.
    """
    if gcs_path.startswith("gs://"):
        gcs_path = gcs_path[5:]
    if gcs_path.endswith("/"):
        gcs_path = gcs_path[:-1]

    gcs_parts = gcs_path.split("/", 1)
    gcs_bucket = gcs_parts[0]
    gcs_blob_prefix = None if len(gcs_parts) == 1 else gcs_parts[1]

    return (gcs_bucket, gcs_blob_prefix)


def upload_blob(source_file_name: str, bucket_name: str, destination_blob_name: str):
    """Uploads a file to the bucket."""

    bucket_name, blob_name = extract_bucket_and_prefix_from_gcs_path(
        f"{bucket_name}/{destination_blob_name}/{Path(source_file_name).stem}"
    )

    storage_client = storage.Client()
    bucket = storage_client.bucket(bucket_name)
    blob = bucket.blob(blob_name)

    blob.upload_from_filename(source_file_name)

    destination_file_name = os.path.join("gs://", bucket_name, blob_name or "")

    return destination_file_name
