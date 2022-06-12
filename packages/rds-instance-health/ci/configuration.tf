terraform {
    // backend "http" {}

    required_providers {
        aws = {
            version = ">= 4"
            source  = "hashicorp/aws"
        }
    }
}

provider "aws" {
    shared_config_files      = [ "~/.aws/config" ]
    shared_credentials_files = [ "~/.aws/credentials" ]

    profile = (var.environment == "UAT" || var.environment == "Pre-Production" || var.environment == "Production") ? "production" : "default"

    skip_get_ec2_platforms      = true
    skip_metadata_api_check     = true
    skip_region_validation      = true
    skip_credentials_validation = true
    skip_requesting_account_id  = true
}

module "region" {
    source = "./modules/region"
}

module "identity" {
    source = "./modules/identity"
}

data "aws_partition" "current" {}

locals {}
