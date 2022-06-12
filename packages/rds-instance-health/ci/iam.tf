resource "aws_iam_role" "role" {
    name = join("-", [
        title(var.name), "STS-IAM-Role"
    ])

    assume_role_policy = jsonencode({
        Version   = "2012-10-17"
        Statement = [
            {
                Action    = "sts:AssumeRole"
                Effect    = "Allow"
                Principal = {
                    Service = "lambda.amazonaws.com"
                }
            }
        ]
    })
}

/// Base Lambda Invocation Service-Role Association
resource "aws_iam_role_policy_attachment" "lambda-access-policy-attachment" {
    role       = aws_iam_role.role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

/// API-Gateway Cloudwatch IAM Association
resource "aws_iam_role_policy_attachment" "api-gateway-cloudwatch-access-policy-attachment" {
    role       = aws_iam_role.role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonAPIGatewayPushToCloudWatchLogs"
}

/// Lambda VPC Configuration IAM Association
resource "aws_iam_role_policy_attachment" "vpc-access-policy-attachment" {
    role       = aws_iam_role.role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}

/// Provides AWS Lambda functions permissions to interact with Amazon S3 Object Lambda, grants Lambda permissions to write to CloudWatch Logs
resource "aws_iam_role_policy_attachment" "s3-access-policy-attachment" {
    role       = aws_iam_role.role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonS3ObjectLambdaExecutionRolePolicy"
}

/// Provides receive message, delete message, and read attribute access to SQS queues, and write permissions to CloudWatch logs.
resource "aws_iam_role_policy_attachment" "sqs-access-policy-attachment" {
    role       = aws_iam_role.role.name
    policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaSQSQueueExecutionRole"
}

/*** Allow Testing via AWS Console */
resource "aws_lambda_permission" "api-gateway-console-usage" {
    count = (var.api-gateway != null && var.api-gateway-method != null && var.api-gateway-path != null) ? 1 : 0
    statement_id  = "Allow-API-Gateway-Invoke-${var.api-gateway-method}"
    action        = "lambda:InvokeFunction"
    function_name = aws_lambda_function.function.function_name
    principal     = "apigateway.amazonaws.com"

    source_arn = "arn:aws:execute-api:${data.aws_arn.execution[0].region}:${data.aws_arn.execution[0].account}:${data.aws_api_gateway_rest_api.api-gateway[0].id}/*/${var.api-gateway-method}/${var.api-gateway-path}"
}
