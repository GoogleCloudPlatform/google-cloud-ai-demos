import os
import logging

logger = logging.getLogger(__name__)

API_KEY = os.environ.get("GCP_API_KEY")
GCS_BUCKET = os.environ.get("GCS_BUCKET")

if API_KEY is None or len(API_KEY) == 0:
    logger.error("GCP_API_KEY not set")
    raise RuntimeError("GCP_API_KEY not set")

if GCS_BUCKET is None or len(GCS_BUCKET) == 0:
    logger.error("GCS_BUCKET not set")
    raise RuntimeError("GCS_BUCKET not set")
