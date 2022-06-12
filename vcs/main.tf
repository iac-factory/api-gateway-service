terraform {
    backend "http" {}
    required_providers {
        gitlab = {
            source = "gitlabhq/gitlab"
            version = "3.15.1"
        }
    }
}

locals {
    gitlab-settings-file = file(join("/", [abspath(path.module), "settings.json"]))
    gitlab-settings = jsondecode(local.gitlab-settings-file)

    gitlab-token = local.gitlab-settings["token"]
    gitlab-project = local.gitlab-settings["project"]
    gitlab-url = local.gitlab-settings["url"]

    total = (var.variables != null) ? length(var.variables) : 0
}

variable "project" {
    type = string
    default = null
}

variable "create-project" {
    type = bool
    default = false
}

variable "import-project" {
    type = bool
    default = true
}

variable "environment" { default = null }
variable "variables" {
    type = list(object({
        key = string
        value = string
    }))

    default = null
}

provider "gitlab" {
    token = local.gitlab-token
    base_url = local.gitlab-url
}

resource "gitlab_project_variable" "variable" {
    count = local.total

    project   = local.gitlab-project
    key       = (var.variables != null) ? var.variables[count.index].key : "..."
    value     = (var.variables != null) ? var.variables[count.index].value : "..."
    protected = true

    environment_scope = var.environment
}

resource "gitlab_project" "project" {
    count = (var.create-project == true) ? 1 : 0

    name = var.project
}

data "gitlab_project" "project" {
    count = (var.import-project == true) ? 1 : 0

    id = local.gitlab-project
}

output "settings" {
    sensitive = true
    value = {
        gitlab-settings-file = local.gitlab-settings-file
        gitlab-settings = local.gitlab-settings
        gitlab-token = local.gitlab-token
        gitlab-project = local.gitlab-project
        gitlab-url = local.gitlab-url
    }
}

output "project" {
    sensitive = true
    value = (var.import-project) ? data.gitlab_project.project : gitlab_project.project
}
