resource "aws_s3_bucket" "s3" {
    bucket = format("%s-artifacts", replace(replace(var.name, "_", "-"), " ", "-"))
    force_destroy = true
}

resource "aws_s3_object" "artifacts" {
    bucket = aws_s3_bucket.s3.bucket
    key    = join("/", [var.name, "distribution", basename(data.archive_file.lambda-function-artifact.output_path)])
    source = join("/", [ join("/", [ path.module, "distribution"]), basename(data.archive_file.lambda-function-artifact.output_path)])
    source_hash = data.archive_file.lambda-function-artifact.output_sha
}

resource "aws_s3_object" "artifacts-layer" {
    bucket = aws_s3_bucket.s3.bucket
    key    = join("/", [var.name, "build", basename(data.archive_file.lambda-function-artifact.output_path)])
    source = join("/", [ join("/", [ path.module, "build"]), basename(data.archive_file.lambda-function-layer.output_path)])
    source_hash = data.archive_file.lambda-function-layer.output_sha
}

resource "aws_lambda_function" "function" {
    function_name = var.name /// substr(var.name, 0, 139)
    filename      = join("/", [ join("/", [ path.module, "distribution"]), basename(data.archive_file.lambda-function-artifact.output_path)])
    description   = var.description
    memory_size   = (var.memory-size != null) ? var.memory-size : 256
    package_type  = "Zip"
    runtime       = (var.runtime != null) ? var.runtime : "nodejs16.x"
    role          = aws_iam_role.role.arn
    handler       = var.handler
    timeout       = (var.timeout != null) ? var.timeout : 30

    layers = [
        aws_lambda_layer_version.primary.arn
    ]

    vpc_config {
        security_group_ids = [
            data.aws_security_group.sg.id
        ]

        subnet_ids         = (var.subnets != null) ? var.subnets : data.aws_subnets.subnets.ids
    }

    tracing_config {
        mode = "Active"
    }

    environment {
        variables = var.environment-variables
    }

    depends_on = [
        aws_iam_role_policy_attachment.api-gateway-cloudwatch-access-policy-attachment,
        aws_iam_role_policy_attachment.lambda-access-policy-attachment,
        aws_iam_role_policy_attachment.s3-access-policy-attachment,
        aws_iam_role_policy_attachment.sqs-access-policy-attachment,
        aws_iam_role_policy_attachment.vpc-access-policy-attachment,
        aws_iam_role.role
    ]
}

resource "aws_lambda_layer_version" "primary" {
    s3_bucket = aws_s3_object.artifacts-layer.bucket
    s3_key = aws_s3_object.artifacts-layer.key

    source_code_hash = data.archive_file.lambda-function-layer.output_sha

    layer_name = join("-", [title(var.name), "Layer"])
}

resource "aws_lambda_alias" "alias" {
    function_name    = aws_lambda_function.function.function_name
    function_version = "$LATEST"

    name = aws_lambda_function.function.function_name

    depends_on = [
        aws_iam_role_policy_attachment.api-gateway-cloudwatch-access-policy-attachment,
        aws_iam_role_policy_attachment.lambda-access-policy-attachment,
        aws_iam_role_policy_attachment.s3-access-policy-attachment,
        aws_iam_role_policy_attachment.sqs-access-policy-attachment,
        aws_iam_role_policy_attachment.vpc-access-policy-attachment
    ]
}

resource "aws_lambda_function_url" "url" {
    count = (var.url == true) ? 1 : 0
    function_name      = aws_lambda_function.function.function_name
    qualifier          = aws_lambda_alias.alias.name
    authorization_type = "AWS_IAM"

    cors {
        allow_credentials = true
        allow_origins     = ["*"]
        allow_methods     = ["*"]
        allow_headers     = ["date", "keep-alive"]
        expose_headers    = ["keep-alive", "date"]
        max_age           = 86400
    }
}
