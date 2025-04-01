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
  set_secrets = [
    "PRIVATE_KEY=projects/706952489382/secrets/INGEST_PRIVATE_KEY",
    "PUBLIC_KEY=projects/706952489382/secrets/INGEST_PUBLIC_KEY",
    "GFW_APP_TOKEN=projects/706952489382/secrets/GFW_APP_TOKEN_DEV",
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
  set_secrets = [
    "PRIVATE_KEY=projects/706952489382/secrets/INGEST_PRIVATE_KEY",
    "PUBLIC_KEY=projects/706952489382/secrets/INGEST_PUBLIC_KEY",
    "GFW_APP_TOKEN=projects/706952489382/secrets/GFW_APP_TOKEN_STA",
  ]
}


module "production" {
  source            = "../cloudbuild-template"
  repository        = "api-ingest"
  project_id        = "gfw-production"
  docker_image      = "us-central1-docker.pkg.dev/gfw-int-infrastructure/api/api-ingest:latest-pro"
  api_name          = "api-ingest"
  short_environment = "pro"
  service_account   = "api-ingest-pro@gfw-production.iam.gserviceaccount.com"
  push_config = {
    branch       = "master"
    invert_regex = false
  }
  labels = {
    environment      = "production"
    resource_creator = "engineering"
    project          = "api"
  }
  set_env_vars = [
    "UPLOAD_BUCKET=gfw-api-ingest-pro-us-central1",
    "UPLOAD_DIR=received",
    "UPLOAD_PROJECT=gfw-ingestion",
  ]
  set_secrets = [
    "PRIVATE_KEY=projects/674016975526/secrets/INGEST_PRIVATE_KEY",
    "PUBLIC_KEY=projects/674016975526/secrets/INGEST_PUBLIC_KEY",
    "GFW_APP_TOKEN=projects/674016975526/secrets/GFW_APP_TOKEN_PRO",
  ]
}
