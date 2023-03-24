#
# Example Terraform Config to create a
# MongoDB Atlas Shared Tier Project, Cluster,
# Database User and Project IP Whitelist Entry
#
# First step is to create a MongoDB Atlas account
# https://docs.atlas.mongodb.com/tutorial/create-atlas-account/
#
# Then create an organization and programmatic API key
# https://docs.atlas.mongodb.com/tutorial/manage-organizations
# https://docs.atlas.mongodb.com/tutorial/manage-programmatic-access
#
# Terraform MongoDB Atlas Provider Documentation
# https://www.terraform.io/docs/providers/mongodbatlas/index.html
# Terraform 0.14+, MongoDB Atlas Provider 0.9.1+

#
#  Local Variables
#  You may want to put these in a variables.tf file
#  Do not check a file containing these variables in a public repository

locals {
  # Replace ORG_ID, PUBLIC_KEY and PRIVATE_KEY with your Atlas variables
  mongodb_atlas_api_pub_key = "PUBLIC_KEY"
  mongodb_atlas_api_pri_key = "PRIVATE_KEY"
  mongodb_atlas_org_id  = "64175209a47d8b185e3f9324"

  # Replace USERNAME And PASSWORD with what you want for your database user
  # https://docs.atlas.mongodb.com/tutorial/create-mongodb-user-for-cluster/
  mongodb_atlas_database_username = "USERNAME"
  mongodb_atlas_database_user_password = "PASSWORD"

  # Replace IP_ADDRESS with the IP Address from where your application will connect
  # https://docs.atlas.mongodb.com/security/add-ip-address-to-list/
  mongodb_atlas_accesslistip = "IP_ADDRESS"
}



provider "mongodbatlas" {
  public_key  = var.atlas_public_key 
  private_key = var.mongodbatlas_private_key 
  //private_key = "769b3adf-7643-481f-a071-fa5a2bbc0b53"
}

#
# Create a Project
#
resource "mongodbatlas_project" "my_project" {
  name   = "${var.app_name}-${terraform.workspace}"
  org_id = var.atlas_org_id
}

#
# Create a Shared Tier Cluster
#
resource "mongodbatlas_cluster" "my_cluster" {
  project_id              = var.atlas_project_id
  name                    = "${var.app_name}-${terraform.workspace}"

  # Provider Settings "block"
  provider_name = "TENANT"

  # options: AWS AZURE GCP
  backing_provider_name = "GCP"

  # options: M2/M5 atlas regions per cloud provider
  # GCP - CENTRAL_US SOUTH_AMERICA_EAST_1 WESTERN_EUROPE EASTERN_ASIA_PACIFIC NORTHEASTERN_ASIA_PACIFIC ASIA_SOUTH_1
  provider_region_name = "WESTERN_EUROPE"

  # options: M2 M5
  provider_instance_size_name = "M2"

  # Will not change till new version of MongoDB but must be included
  mongo_db_major_version = "5.0"
  auto_scaling_disk_gb_enabled = "false"
}

#
# Create an Atlas Admin Database User
#
resource "mongodbatlas_database_user" "my_user" {
  username           = "storybook-user"
  password           = var.atlas_user_password //"rSaD1o50altmaLJy"
  project_id         = mongodbatlas_project.my_project.id
  auth_database_name = "admin"

  roles {
    role_name     = "atlasAdmin"
    database_name = "admin"
  }
}

#
# Create an IP Accesslist
#
# can also take a CIDR block or AWS Security Group -
# replace ip_address with either cidr_block = "CIDR_NOTATION"
# or aws_security_group = "SECURITY_GROUP_ID"
#
resource "mongodbatlas_project_ip_access_list" "my_ipaddress" {
      project_id = var.atlas_project_id
      ip_address = google_compute_address.ip_address.address
      comment    = "My IP Address"
}

# Use terraform output to display connection strings.
output "connection_strings" {
  value = mongodbatlas_cluster.my_cluster.connection_strings.0.standard_srv
}