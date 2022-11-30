# Built on Vertex AI: Backend

This is the backend code for "Built on Vertex AI".

It uses the following packages:

- [FastAPI](https://fastapi.tiangolo.com/)
- [Google Vertex AI SDK for Python](https://cloud.google.com/vertex-ai/docs/start/use-vertex-ai-python-sdk#install-vertex-ai-python-sdk)
- [Google BigQuery SDK for Python](https://github.com/googleapis/python-bigquery)

## Available Commands

In the project directory, you can run:

### Deployment

Here are a few options on how to deploy the backend to your own Google Cloud project.
Run these commands from the same folder as this README.md file.

#### 1. Build and deploy to Google Cloud Run in one step

```
gcloud beta run deploy built-on-vertex-ai-backend --source . --region=us-central1 --platform=managed --cpu=2 --memory=8G --timeout=3600 --allow-unauthenticated --session-affinity --min-instances=1
```

Package the backend app into a container using the Dockerfile, save it in the Google Container Registry and deploy it on Google Cloud Run.

#### 2. Build a container using Google Cloud Build

```
gcloud builds submit --tag gcr.io/your-project-name/built-on-vertex-ai-backend
```

This uses the Dockerfile to build the container and save it in the Google Container Registry.
This can then be deployed to Cloud Run or other platforms.

See [Deploy a Python service to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service) for more information.

### Development

#### Start local development server

python -m uvicorn main:app --reload --port=8000

### Files

Some important files and folders.

TODO
