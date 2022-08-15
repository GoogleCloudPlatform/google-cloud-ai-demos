# Built on Vertex AI: Frontend

This is the frontend code for "Built on Vertex AI".

It includes following pages:

- Demo landing page
- Wrapper components
- Demos for various use cases

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

It uses the following technologies:

- [React](https://reactjs.org)
- [Material UI](https://mui.com)
- [@tanstack/react-query](https://github.com/tanstack/query)
- [react-hook-form](https://react-hook-form.com)

## Available Commands

In the project directory, you can run:

### Deployment

Here are a few options on how to deploy the web app to your own Google Cloud project.

#### 1. Build and deploy to Google Cloud Run in one step

```
gcloud run deploy forecasting-live-demo --source . --region=us-central1 --cpu=2 --memory=8G --timeout=3600 --allow-unauthenticated
```

Package the frontend into a container using the Dockerfile, save it in the Google Container Registry and deploy it on Google Cloud Run.

#### 2. Build a container using Google Cloud Build

```
gcloud builds submit --tag gcr.io/your-project-name/built-on-vertex-ai-frontend
```

This uses the Dockerfile to build the frontend container and save it in the Google Container Registry.
This can then be deployed to Cloud Run or other platforms.

See [Deploy a Python service to Cloud Run](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-python-service) for more information.

### Development

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm run storybook`

Storybook is a development tool to render UI components in isolation.

See [storybook.js.org](https://storybook.js.org) for more details.

### Files

Some important files and folders.

| File/Folder    | Description                                                                                                                      |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Dockerfile     | Used by Google Cloud Build to containerize the web app for deployment.                                                           |
| nginx.conf     | The nginx config for serving the bundled web app. See https://cloud.google.com/community/tutorials/deploy-react-nginx-cloud-run. |
| /src/common    | React web app: Common code to all demos.                                                                                         |
| /src/demos     | React web app: Code for specific demos.                                                                                          |
| /src/index.tsx | The entrypoint for the web app.                                                                                                  |
| /src/stories   | Code for storybook mocks for web app development. See https://storybook.js.org/                                                  |
