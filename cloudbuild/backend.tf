terraform {
  backend "gcs" {
    bucket = "gfw-int-infrastructure-tfstate-us-central1"
    prefix = "cloudbuild-api-ingest" # Not change for this project
  }
}
