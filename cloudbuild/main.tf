provider "google" {
  project = "gfw-int-infrastructure"
}


module "develop" {
  source            = "../cloudbuild-template"
  repository        = "api-ingest"
  project_id        = "gfw-development"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/api/api-ingest:latest-dev"
  api_name          = "api-ingest"
  short_environment = "dev"
  service_account   = "api-ingest-dev@gfw-development.iam.gserviceaccount.com"
  push_config = {
    branch       = "develop"
    invert_regex = false
  }
  labels = {
    environment      = "develop"
    resource_creator = "engineering"
    project          = "api"
  }
  set_env_vars = [
    "UPLOAD_BUCKET=gfw-api-ingest-dev-us-central1",
    "UPLOAD_DIR=received",
    "UPLOAD_PROJECT=gfw-ingestion",
  ]
}


module "staging" {
  source            = "../cloudbuild-template"
  repository        = "api-ingest"
  project_id        = "gfw-development"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/api/api-ingest:latest-sta"
  api_name          = "api-ingest"
  short_environment = "sta"
  service_account   = "api-ingest-sta@gfw-development.iam.gserviceaccount.com"
  push_config = {
    branch       = "staging"
    invert_regex = false
  }
  labels = {
    environment      = "staging"
    resource_creator = "engineering"
    project          = "api"
  }
  set_env_vars = [
    "UPLOAD_BUCKET=gfw-api-ingest-sta-us-central1",
    "UPLOAD_DIR=received",
    "UPLOAD_PROJECT=gfw-ingestion",
  ]
}
