import os
import logging

logger = logging.getLogger(__name__)

GCP_PROJECT_ID = os.environ.get("GCP_PROJECT_ID")
GCS_BUCKET = os.environ.get("GCS_BUCKET")

if GCP_PROJECT_ID is None or len(GCP_PROJECT_ID) == 0:
    logger.error("GCP_PROJECT_ID not set")
    raise RuntimeError("GCP_PROJECT_ID not set")

if GCS_BUCKET is None or len(GCS_BUCKET) == 0:
    logger.error("GCS_BUCKET not set")
    raise RuntimeError("GCS_BUCKET not set")
