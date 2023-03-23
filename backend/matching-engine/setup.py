# %%
# Copyright 2022 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     https://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# %% [markdown]
# # Create Vertex AI Matching Engine index
# 
# <table align="left">
#   <td>
#     <a href="https://colab.research.google.com/github/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_for_indexing.ipynb">
#       <img src="https://cloud.google.com/ml-engine/images/colab-logo-32px.png" alt="Colab logo"> Run in Colab
#     </a>
#   </td>
#   <td>
#     <a href="https://github.com/GoogleCloudPlatform/vertex-ai-samples/blob/main/notebooks/official/matching_engine/sdk_matching_engine_for_indexing.ipynb">
#       <img src="https://cloud.google.com/ml-engine/images/github-logo-32px.png" alt="GitHub logo">
#       View on GitHub
#     </a>
#   </td>
#       <td>
#     <a href="https://console.cloud.google.com/vertex-ai/workbench/deploy-notebook?download_url=https://raw.githubusercontent.com/GoogleCloudPlatform/vertex-ai-samples/main/notebooks/official/matching_engine/sdk_matching_engine_for_indexing.ipynb">
#       <img src="https://lh3.googleusercontent.com/UiNooY4LUgW_oTvpsNhPpQzsstV5W8F7rYgxgGBD85cWJoLmrOzhVs_ksK_vgx40SHs7jCqkTkCk=e14-rj-sc0xffffff-h130-w32" alt="Vertex AI logo">
#       Open in Vertex AI Workbench
#     </a>
#   </td>
# </table>

# %% [markdown]
# ## Overview
# 
# This example demonstrates how to use the GCP ANN Service. It is a high scale, low latency solution, to find similar vectors (or more specifically "embeddings") for a large corpus. Moreover, it is a fully managed offering, further reducing operational overhead. It is built upon [Approximate Nearest Neighbor (ANN) technology](https://ai.googleblog.com/2020/07/announcing-scann-efficient-vector.html) developed by Google Research.

# %% [markdown]
# ### Objective
# 
# In this notebook, you learn how to create Approximate Nearest Neighbor (ANN) Index, query against indexes, and validate the performance of the index. 
# 
# The steps performed include:
# 
# * Create ANN Index and Brute Force Index
# * Create an IndexEndpoint with VPC Network
# * Deploy ANN Index and Brute Force Index
# * Perform online query
# * Compute recall
# 

# %% [markdown]
# ### Dataset
# 
# The dataset used for this tutorial is the [GloVe dataset](https://nlp.stanford.edu/projects/glove/).
# 
# "GloVe is an unsupervised learning algorithm for obtaining vector representations for words. Training is performed on aggregated global word-word co-occurrence statistics from a corpus, and the resulting representations showcase interesting linear substructures of the word vector space."
# 

# %% [markdown]
# ## Installation
# 
# Install the latest version of Cloud Storage, BigQuery and Vertex AI SDKs for Python.

# %%
# Install the packages
! pip3 install --upgrade google-cloud-aiplatform \
                        google-cloud-storage

# %% [markdown]
# ### Colab only: Uncomment the following cell to restart the kernel.

# %%
# Automatically restart kernel after installs so that your environment can access the new packages
# import IPython

# app = IPython.Application.instance()
# app.kernel.do_shutdown(True)

# %% [markdown]
# ## Before you begin
# #### Set your project ID
# 
# **If you don't know your project ID**, try the following:
# * Run `gcloud config list`.
# * Run `gcloud projects list`.
# * See the support page: [Locate the project ID](https://support.google.com/googleapi/answer/7014113)

# %%
PROJECT_ID = "[your-project-id]"  # @param {type:"string"}

# Set the project id
! gcloud config set project {PROJECT_ID}

# %% [markdown]
# #### Region
# 
# You can also change the `REGION` variable used by Vertex AI. Learn more about [Vertex AI regions](https://cloud.google.com/vertex-ai/docs/general/locations).

# %%
REGION = "us-central1"  # @param {type: "string"}

# %% [markdown]
# ### Authenticate your Google Cloud account
# 
# Depending on your Jupyter environment, you may have to manually authenticate. Follow the relevant instructions below.

# %% [markdown]
# **1. Vertex AI Workbench**
# * Do nothing as you are already authenticated.

# %% [markdown]
# **2. Local JupyterLab instance, uncomment and run:**

# %%
# ! gcloud auth login

# %% [markdown]
# **3. Colab, uncomment and run:**

# %%
# from google.colab import auth
# auth.authenticate_user()

# %% [markdown]
# **4. Service account or other**
# * See how to grant Cloud Storage permissions to your service account at https://cloud.google.com/storage/docs/gsutil/commands/iam#ch-examples.

# %% [markdown]
# ### Prepare a VPC network
# To reduce any network overhead that might lead to unnecessary increase in overhead latency, it is best to call the ANN endpoints from your VPC via a direct [VPC Peering](https://cloud.google.com/vertex-ai/docs/general/vpc-peering) connection. 
#   * The following section describes how to setup a VPC Peering connection if you don't have one. 
#   * This is a one-time initial setup task. You can also reuse existing VPC network and skip this section.

# %%
# VPC_NETWORK = "[your-vpc-network-name]"  # @param {type:"string"}
VPC_NETWORK = "matching-engine-test"  # @param {type:"string"}

PEERING_RANGE_NAME = "ann-haystack-range"

# %%
import os

# Remove the if condition to run the encapsulated code
if not os.getenv("IS_TESTING"):
    # Create a VPC network
    ! gcloud compute networks create {VPC_NETWORK} --bgp-routing-mode=regional --subnet-mode=auto --project={PROJECT_ID}

    # Add necessary firewall rules
    ! gcloud compute firewall-rules create {VPC_NETWORK}-allow-icmp --network {VPC_NETWORK} --priority 65534 --project {PROJECT_ID} --allow icmp

    ! gcloud compute firewall-rules create {VPC_NETWORK}-allow-internal --network {VPC_NETWORK} --priority 65534 --project {PROJECT_ID} --allow all --source-ranges 10.128.0.0/9

    ! gcloud compute firewall-rules create {VPC_NETWORK}-allow-rdp --network {VPC_NETWORK} --priority 65534 --project {PROJECT_ID} --allow tcp:3389

    ! gcloud compute firewall-rules create {VPC_NETWORK}-allow-ssh --network {VPC_NETWORK} --priority 65534 --project {PROJECT_ID} --allow tcp:22

    # Reserve IP range
    ! gcloud compute addresses create {PEERING_RANGE_NAME} --global --prefix-length=16 --network={VPC_NETWORK} --purpose=VPC_PEERING --project={PROJECT_ID} --description="peering range"

    # Set up peering with service networking
    # Your account must have the "Compute Network Admin" role to run the following.
    ! gcloud services vpc-peerings connect --service=servicenetworking.googleapis.com --network={VPC_NETWORK} --ranges={PEERING_RANGE_NAME} --project={PROJECT_ID}

# %% [markdown]
# * Authentication: Rerun the `gcloud auth login` command in the Vertex AI Workbench notebook terminal when you are logged out and need the credential again.

# %% [markdown]
# ## Make sure the following cells are run from inside the VPC network that you created in the previous step.
# 
# * **WARNING:** The MatchingIndexEndpoint.match method (to create online queries against your deployed index) has to be executed in a Vertex AI Workbench notebook instance that is created with the following requirements:
#   * **In the same region as where your ANN service is deployed** (for example, if you set `REGION = "us-central1"` as same as the tutorial, the notebook instance has to be in `us-central1`).
#   * **Make sure you select the VPC network you created for ANN service** (instead of using the "default" one). That is, you will have to create the VPC network below and then create a new notebook instance that uses that VPC.  
#   * If you run it in the colab or a Vertex AI Workbench notebook instance in a different VPC network or region, "Create Online Queries" section will fail.

# %% [markdown]
# ### Installation
# 
# Download and install the latest version of the Vertex SDK for Python.

# %%
! pip install --upgrade --quiet google-cloud-aiplatform grpcio-tools h5py

# %% [markdown]
# Install the `h5py` to prepare sample dataset, and the `grpcio-tools` for querying against the index. 

# %% [markdown]
# ### Colab only: Uncomment the following cell to restart the kernel.

# %%
# Automatically restart kernel after installs so that your environment can access the new packages
# import IPython

# app = IPython.Application.instance()
# app.kernel.do_shutdown(True)

# %% [markdown]
# ### Create a Cloud Storage bucket
# 
# Create a storage bucket to store intermediate artifacts such as datasets.

# %%
BUCKET_URI = "gs://your-bucket-name-unique"  # @param {type:"string"}

# %% [markdown]
# **Only if your bucket doesn't already exist**: Run the following cell to create your Cloud Storage bucket.

# %%
! gsutil mb -l $REGION -p $PROJECT_ID $BUCKET_URI

# %% [markdown]
# ## Prepare the data
# 
# The GloVe dataset consists of a set of pre-trained embeddings. The embeddings are split into a "train" split, and a "test" split.
# We will create a vector search index from the "train" split, and use the embedding vectors in the "test" split as query vectors to test the vector search index.
# 
# **Note:** While the data split uses the term "train", these are pre-trained embeddings and therefore are ready to be indexed for search. The terms "train" and "test" split are used just to be consistent with machine learning terminology.
# 
# Download the GloVe dataset.
# 

# %%
! gsutil cp gs://cloud-samples-data/vertex-ai/matching_engine/glove-100-angular.hdf5 .

# %% [markdown]
# Read the data into memory.
# 

# %%
import h5py

# The number of nearest neighbors to be retrieved from database for each query.
NUM_NEIGHBOURS = 10

h5 = h5py.File("glove-100-angular.hdf5", "r")
train = h5["train"]
test = h5["test"]

# %%
train[0]

# %% [markdown]
# #### Save the train split in JSONL format.
# 
# The data must be formatted in JSONL format, which means each embedding dictionary is written as a JSON string on its own line.
# 
# Additionally, to demonstrate the filtering functionality, the `restricts` key is set such that each embedding has a different `class`, `even` or `odd`. These are used during the later matching step to filter for results.
# See additional information of filtering here: https://cloud.google.com/vertex-ai/docs/matching-engine/filtering

# %%
import json

with open("glove100.json", "w") as f:
    embeddings_formatted = [
        json.dumps(
            {
                "id": str(index),
                "embedding": [str(value) for value in train[index]],
                "restricts": [
                    {
                        "namespace": "class",
                        "allow_list": ["even" if index % 2 == 0 else "odd"],
                    }
                ],
            }
        )
        + "\n"
        for index, embedding in enumerate(train)
    ]
    f.writelines(embeddings_formatted)

# %% [markdown]
# Upload the training data to GCS.

# %%
EMBEDDINGS_INITIAL_URI = f"{BUCKET_URI}/matching_engine/initial/"
! gsutil cp glove100.json {EMBEDDINGS_INITIAL_URI}

# %% [markdown]
# ## Create Indexes
# 

# %% [markdown]
# ### Create ANN Index (for Production Usage)

# %%
DIMENSIONS = 100
DISPLAY_NAME = "glove_100_1"
DISPLAY_NAME_BRUTE_FORCE = DISPLAY_NAME + "_brute_force"

# %% [markdown]
# Create the ANN index configuration:
# 
# To learn more about configuring the index, see [Input data format and structure](https://cloud.google.com/vertex-ai/docs/matching-engine/match-eng-setup#input-data-format).
# 

# %%
import os

from google.cloud import aiplatform

aiplatform.init(project=PROJECT_ID, location=REGION, staging_bucket=BUCKET_URI)

# %%
tree_ah_index = aiplatform.MatchingEngineIndex.create_tree_ah_index(
    display_name=DISPLAY_NAME_BRUTE_FORCE,
    contents_delta_uri=EMBEDDINGS_INITIAL_URI,
    dimensions=DIMENSIONS,
    approximate_neighbors_count=150,
    distance_measure_type="DOT_PRODUCT_DISTANCE",
    leaf_node_embedding_count=500,
    leaf_nodes_to_search_percent=7,
    description="Glove 100 ANN index",
    labels={"label_name": "label_value"},
)

# %%
INDEX_RESOURCE_NAME = tree_ah_index.resource_name
INDEX_RESOURCE_NAME

# %% [markdown]
# Using the resource name, you can retrieve an existing MatchingEngineIndex.

# %%
tree_ah_index = aiplatform.MatchingEngineIndex(index_name=INDEX_RESOURCE_NAME)

# %% [markdown]
# ### Create Brute Force Index (for Ground Truth)
# 
# The brute force index uses a naive brute force method to find the nearest neighbors. This method is not fast or efficient. Hence brute force indices are not recommended for production usage. They are to be used to find the "ground truth" set of neighbors, so that the "ground truth" set can be used to measure recall of the indices being tuned for production usage. To ensure an apples to apples comparison, the `distanceMeasureType` and `dimensions` of the brute force index should match those of the production indices being tuned.
# 
# Create the brute force index configuration:

# %%
brute_force_index = aiplatform.MatchingEngineIndex.create_brute_force_index(
    display_name=DISPLAY_NAME,
    contents_delta_uri=EMBEDDINGS_INITIAL_URI,
    dimensions=DIMENSIONS,
    distance_measure_type="DOT_PRODUCT_DISTANCE",
    description="Glove 100 index (brute force)",
    labels={"label_name": "label_value"},
)

# %%
INDEX_BRUTE_FORCE_RESOURCE_NAME = brute_force_index.resource_name
INDEX_BRUTE_FORCE_RESOURCE_NAME

# %%
brute_force_index = aiplatform.MatchingEngineIndex(
    index_name=INDEX_BRUTE_FORCE_RESOURCE_NAME
)

# %% [markdown]
# ## Update Indexes
# 
# Create incremental data file.
# 

# %%
with open("glove100_incremental.json", "w") as f:
    index = 0
    f.write(
        json.dumps(
            {
                "id": str(index),
                "embedding": [str(0) for _ in train[index]],
                "restricts": [
                    {
                        "namespace": "class",
                        "allow_list": ["even" if index % 2 == 0 else "odd"],
                    }
                ],
            }
        )
        + "\n"
    )

# %% [markdown]
# Copy the incremental data file to a new subdirectory.
# 

# %%
EMBEDDINGS_UPDATE_URI = f"{BUCKET_URI}/matching-engine/incremental/"

# %%
! gsutil cp glove100_incremental.json {EMBEDDINGS_UPDATE_URI}

# %% [markdown]
# Create update index request
# 

# %%
tree_ah_index = tree_ah_index.update_embeddings(
    contents_delta_uri=EMBEDDINGS_UPDATE_URI,
)

# %%
INDEX_RESOURCE_NAME = tree_ah_index.resource_name
INDEX_RESOURCE_NAME

# %% [markdown]
# ## Create an IndexEndpoint with VPC Network

# %%
# Retrieve the project number
PROJECT_NUMBER = !gcloud projects list --filter="PROJECT_ID:'{PROJECT_ID}'" --format='value(PROJECT_NUMBER)'
PROJECT_NUMBER = PROJECT_NUMBER[0]

VPC_NETWORK = "[your-network-name]"
VPC_NETWORK_FULL = "projects/{}/global/networks/{}".format(PROJECT_NUMBER, VPC_NETWORK)
VPC_NETWORK_FULL

# %%
my_index_endpoint = aiplatform.MatchingEngineIndexEndpoint.create(
    display_name="index_endpoint_for_demo",
    description="index endpoint description",
    network=VPC_NETWORK_FULL,
)

# %%
INDEX_ENDPOINT_NAME = my_index_endpoint.resource_name
INDEX_ENDPOINT_NAME

# %% [markdown]
# ## Deploy Indexes

# %% [markdown]
# ### Deploy ANN Index

# %%
DEPLOYED_INDEX_ID = "tree_ah_glove_deployed_unique"

# %%
my_index_endpoint = my_index_endpoint.deploy_index(
    index=tree_ah_index, deployed_index_id=DEPLOYED_INDEX_ID
)

my_index_endpoint.deployed_indexes

# %% [markdown]
# ### Deploy Brute Force Index

# %%
DEPLOYED_BRUTE_FORCE_INDEX_ID = "glove_brute_force_deployed_unique"

# %%
my_index_endpoint = my_index_endpoint.deploy_index(
    index=brute_force_index, deployed_index_id=DEPLOYED_BRUTE_FORCE_INDEX_ID
)

my_index_endpoint.deployed_indexes

# %% [markdown]
# ## Create Online Queries
# 
# After you built your indexes, you may query against the deployed index through the online querying gRPC API (Match service) within the virtual machine instances from the same region (for example 'us-central1' in this tutorial).
# 
# The `filter` parameter is an optional way to filter for a subset of embeddings. In this case, only embeddings that have the `class` set as `even` are returned.

# %%
# Test query
from google.cloud.aiplatform.matching_engine.matching_engine_index_endpoint import \
    Namespace

# Test query
response = my_index_endpoint.match(
    deployed_index_id=DEPLOYED_INDEX_ID,
    queries=test[:1],
    num_neighbors=NUM_NEIGHBOURS,
    filter=[Namespace("class", ["even"])],
)

response

# %% [markdown]
# ### Compute Recall
# 
# Use the deployed brute force Index as the ground truth to calculate the recall of ANN Index. Note that you can run multiple queries in a single match call.

# %%
# Retrieve nearest neighbors for both the tree-AH index and the brute-force index
tree_ah_response_test = my_index_endpoint.match(
    deployed_index_id=DEPLOYED_INDEX_ID,
    queries=list(test),
    num_neighbors=NUM_NEIGHBOURS,
)
brute_force_response_test = my_index_endpoint.match(
    deployed_index_id=DEPLOYED_BRUTE_FORCE_INDEX_ID,
    queries=list(test),
    num_neighbors=NUM_NEIGHBOURS,
)

# %%
# Calculate recall by determining how many neighbors were correctly retrieved as compared to the brute-force option.
recalled_neighbors = 0
for tree_ah_neighbors, brute_force_neighbors in zip(
    tree_ah_response_test, brute_force_response_test
):
    tree_ah_neighbor_ids = [neighbor.id for neighbor in tree_ah_neighbors]
    brute_force_neighbor_ids = [neighbor.id for neighbor in brute_force_neighbors]

    recalled_neighbors += len(
        set(tree_ah_neighbor_ids).intersection(brute_force_neighbor_ids)
    )

recall = recalled_neighbors / len(
    [neighbor for neighbors in brute_force_response_test for neighbor in neighbors]
)

print("Recall: {}".format(recall))

# %% [markdown]
# ## Cleaning up
# 
# To clean up all Google Cloud resources used in this project, you can [delete the Google Cloud
# project](https://cloud.google.com/resource-manager/docs/creating-managing-projects#shutting_down_projects) you used for the tutorial.
# You can also manually delete resources that you created by running the following code.

# %%
# Force undeployment of indexes and delete endpoint
my_index_endpoint.delete(force=True)

# %%
# Delete indexes
tree_ah_index.delete()
brute_force_index.delete()


