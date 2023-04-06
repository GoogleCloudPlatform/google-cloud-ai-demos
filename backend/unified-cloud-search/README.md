# AI Demos: Matching Engine Backend

This is the backend code for "Built on Vertex AI".

It uses the following packages:

- [FastAPI](https://fastapi.tiangolo.com/)
- [Google Vertex AI SDK for Python](https://cloud.google.com/vertex-ai/docs/start/use-vertex-ai-python-sdk#install-vertex-ai-python-sdk)

## Available Commands

In the project directory, you can run:

### Deployment

Here are a few options on how to deploy the backend to your own Google Cloud project.
Run these commands from the same folder as this README.md file.

#### Prerequisite

##### Set up VPC network

Make sure you already have a VPC network set up. See [Create Vertex AI Matching Engine index](https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_for_indexing.ipynb) for details.

##### Create Matching Engine indexes and update register_services.py

1. Create embeddings and indexes
   See [Matching Engine notebooks](https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine) for code to convert text and images to embeddings and create indexes.
2. Update register_services.py to point to your indexes.

#### 1. Build and deploy to Google Cloud Run in one step

```
gcloud run deploy your-backend-name --source . --region=us-central1 --platform=managed --cpu=2 --memory=8G --timeout=3600 --allow-unauthenticated --session-affinity --min-instances=1
```

This uploads the source to Cloud Build, packages the backend app into a container using the Dockerfile, and saves it in the Google Container Registry. It then automatically deploys it on Google Cloud Run.

#### 2. Build a container using Google Cloud Build

```
gcloud builds submit --tag gcr.io/your-project-name/your-backend-name
```

This uses the Dockerfile to build the container and save it in the Google Container Registry.
This can then be deployed to Cloud Run or other platforms using the following command:

```
gcloud beta run deploy your-backend-name --image gcr.io/your-project-name/your-backend-name:latest --region=us-central1 --platform=managed --cpu=8 --memory=32G --timeout=3600 --allow-unauthenticated --min-instances=1 --vpc-connector=matching-engine-connector --set-env-vars TIMEOUT=0
```

See [Deploy a Python service to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service) for more information.

### Development

#### Prerequisite

The local development server assumes you have pre-downloaded the relevant data and pre-trained models. See the Dockerfile for relevant commands.

#### Start local development server

python -m uvicorn main:app --reload --port=8000
