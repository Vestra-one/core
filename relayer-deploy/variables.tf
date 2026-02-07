variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region (e.g. us-central1)"
  type        = string
}

variable "network" {
  description = "NEAR network: mainnet or testnet"
  type        = string
}

variable "relayer_name" {
  description = "Relayer service name (prefix for resources)"
  type        = string
}

variable "docker_image" {
  description = "Relayer Docker image URL"
  type        = string
}

variable "config_file_path" {
  description = "Path to config.toml"
  type        = string
}

variable "account_key_file_paths" {
  description = "Paths to relayer account key JSON files"
  type        = list(string)
}
