terraform{
    backend "gcs" {
        bucket = "storybooks-381119-terraform"
        prefix = "/state/storybooks"
    }
    required_providers {
        google = {
            source = "hashicorp/google"
            version = "3.38"
        }
        mongodbatlas = {
            source  = "mongodb/mongodbatlas",
            version = "1.8.0"
        }
        cloudflare = {
            source = "cloudflare/cloudflare"
            version = "2.18.0"
        }
    } 
}