provider "google" {
  //credentials = file("client_secret_215402347283-8odhdbkfqp8vqq32mavs1794luslf6n8.apps.googleusercontent.com.json")
  //credentials = file("/Users/ullrich/Development/Docker/DevOpsCrashCourse/storybooks/storybooks-381119-8ae71c6c6015.json")
  credentials = file("/Users/ullrich/Development/Docker/DevOpsCrashCourse/storybooks/storybooks-381119-7782437488d9.json")
  project     = "storybooks-381119" #var.gcp_project_id
  region      = "us-central1"
  zone        = "us-central1-c"
  //version     = "~> 3.38"
}

# IP ADDRESS
resource "google_compute_address" "ip_address" {
  name = "storybooks-ip-${terraform.workspace}"
}

# NETWORK
data "google_compute_network" "default" {
  name = "default"
}

# FIREWALL RULE
resource "google_compute_firewall" "allow_http" {
  name    = "allow-http-${terraform.workspace}"
  network = data.google_compute_network.default.name

  allow {
    protocol = "tcp"
    ports    = ["80"]
  }

  source_ranges = ["0.0.0.0/0"]

  target_tags = ["allow-http-${terraform.workspace}"]
}

# OS IMAGE
data "google_compute_image" "cos_image" {
  family  = "cos-101-lts"
  project = "cos-cloud"
}

# COMPUTE ENGINE INSTANCE
resource "google_compute_instance" "instance" {
  name         = "${var.app_name}-vm-${terraform.workspace}"
  machine_type = var.gcp_machine_type
  zone         = "us-central1-a"

  tags = google_compute_firewall.allow_http.target_tags

  boot_disk {
    initialize_params {
      image = data.google_compute_image.cos_image.self_link
    }
  }

  network_interface {
    network = data.google_compute_network.default.name

    access_config {
      nat_ip = google_compute_address.ip_address.address
    }
  }

  service_account {
    scopes = ["storage-ro"]
  }
}
