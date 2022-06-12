data "aws_security_group" "sg" {
    name = var.security-group-name
}

data "aws_vpc" "vpc" {
    id = data.aws_security_group.sg.vpc_id
}

data "aws_subnets" "subnets" {
    filter {
        name   = "vpc-id"
        values = [data.aws_vpc.vpc.id]
    }
}

data "aws_subnet" "subnet" {
    for_each = toset(data.aws_subnets.subnets.ids)
    id       = each.value
}

data "archive_file" "lambda-function-artifact" {
    type        = "zip"
    source_dir  = join("/", [ dirname(abspath(path.module)), "build", "src" ])
    output_path = join("/", [ path.module, "distribution", join(".", [ format("%s-%s", lower(replace(var.name, " ", "-")), formatdate("MMM-DD-YYYY-hh-mm-ss", timestamp())), "zip" ]) ])
    output_file_mode = "666"
}

data "archive_file" "lambda-function-layer" {
    type        = "zip"
    source_dir  = join("/", [ dirname(abspath(path.module)), "layer" ])
    output_path = join("/", [ path.module, "build", join(".", [ format("%s-%s", lower(replace(var.name, " ", "-")), formatdate("MMM-DD-YYYY-hh-mm-ss", timestamp())), "zip" ]) ])
    output_file_mode = "666"
}

data "aws_api_gateway_rest_api" "api-gateway" {
    count = (var.api-gateway != null) ? 1 : 0
    name = var.api-gateway
}

/*** Allows Full ARN Resolution including Account, Regions, Identifiers */
data "aws_arn" "execution" {
    count = (var.api-gateway != null) ? 1 : 0
    arn =  "arn:${data.aws_partition.current.partition}:execute-api:${module.region.current}:${module.identity.account-id}:${data.aws_api_gateway_rest_api.api-gateway[0].id}/"
}