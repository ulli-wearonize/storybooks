### GENERAL
variable "app_name" {
  type = string
}

#variable "OAUTH_CLIENT_ID" {
#  type = string
#}

### ATLAS
variable "atlas_project_id" {
  type = string
}

variable "atlas_org_id" {
  type = string
}

variable "mongodbatlas_public_key" {
  type = string
}

variable "mongodbatlas_private_key" {
  type = string
}

variable "atlas_user_password" {
  type = string
}

variable "atlas_public_key" {
  type = string
}

variable "atlas_private_key" {
  type = string
}

### GCP
variable "gcp_project_id" {
  type = string
}

variable "gcp_machine_type" {
  type = string
}

### CLOUDFLARE
variable "cloudflare_api_token" {
  type = string
}

variable "domain" {
  type = string
}
