terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

provider "google-beta" {
  project = var.project_id
  region  = var.region
}

module "relayer" {
  source = "github.com/near/terraform-near-relayer//modules/gcp-relayer"

  project_id             = var.project_id
  region                 = var.region
  network                = var.network
  relayer_name           = var.relayer_name
  docker_image           = var.docker_image
  config_file_path       = var.config_file_path
  account_key_file_paths = var.account_key_file_paths
}
