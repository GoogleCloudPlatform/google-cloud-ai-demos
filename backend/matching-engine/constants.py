import os
import logging

logger = logging.getLogger(__name__)

API_KEY = os.environ.get("GCP_API_KEY") or ""
GCS_BUCKET = os.environ.get("GCS_BUCKET") or ""

if len(API_KEY) == 0:
    logger.error("GCP_API_KEY not set")

if len(GCS_BUCKET) == "":
    logger.error("GCS_BUCKET not set")
