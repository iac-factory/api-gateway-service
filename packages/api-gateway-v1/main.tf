variable "api-version" { default = "v1" }
variable "api-gateway-version" { default = "1.0" }
variable "api-gateway-type" { default = "REGIONAL" }
variable "api-gateway-name" { default = "Example-API-Gateway" }

variable "stage" { default = "stage" }

variable "lambda" {
    default = "example-rds-lambda-function"
}

module "region" {
    source = "./modules/region"
}

locals {
    models = {
        ip = "IP"
    }
}

data "aws_lambda_function" "lambda" {
    function_name = try(var.lambda, null)
}

resource "aws_api_gateway_rest_api" "rest-api-gateway" {
    body = jsonencode({
        openapi = "3.0.1"

        // servers = [
        //     {
        //         url = "${var.api-gateway-domain-name}/{base}",
        //         variables = {
        //             base = {
        //                 default = var.api-version
        //             }
        //         }
        //     }
        // ]

        info = {
            title   = var.api-gateway-name
            version = "0.0.1"
        }

        responses = {
            200 = {
                description = "Successful HTTP Response"
                headers     = {
                    Access-Control-Allow-Origin = {
                        schema = {
                            type = "string"
                        }
                    }

                    Access-Control-Allow-Methods = {
                        schema = {
                            type = "string"
                        }
                    }

                    Access-Control-Allow-Headers = {
                        schema = {
                            type = "string"
                        }
                    }
                }

                content = {
                    "application/json" = {
                        schema = {
                            "$ref" = "#/components/schemas/Default"
                        }
                    }
                }
            }

            500 = {
                description = "500 Internal Server Error"
                headers     = {
                    Access-Control-Allow-Origin = {
                        schema = {
                            type = "string"
                        }
                    }

                    Access-Control-Allow-Methods = {
                        schema = {
                            type = "string"
                        }
                    }

                    Access-Control-Allow-Headers = {
                        schema = {
                            type = "string"
                        }
                    }
                }

                content = {
                    "application/json" = {
                        schema = {
                            "$ref" = "#/components/schemas/Error"
                        }
                    }
                }
            }
        }

        // x-amazon-apigateway-request-validator = "Validate query string parameters and headers"

        paths = {
            "/test" = {
                summary                         = "..."
                description                     = "..."
                get = {
                    x-amazon-apigateway-integration = {
                        type : "aws_proxy"
                        passthroughBehavior : "when_no_match"
                        httpMethod = "POST"
                        uri        = "arn:$${AWS::Partition}:apigateway:$${AWS::Region}:lambda:path/2015-03-31/functions/arn:$${AWS::Partition}:lambda:$${AWS::Region}:$${AWS::AccountId}:function:${var.lambda}/invocations"
                        contentHandling : "CONVERT_TO_TEXT"

                        timeoutInMillis : 29000

                        requestTemplates = {
                            "application/json" = jsonencode({ statusCode = 200 })
                        }

                        requestParameters = {}

                        responses = { default = { statusCode = "200" } }
                    }
                }
            }

            "/${var.api-version}/ip-ranges" = {
                summary     = "..."
                description = "..."

                get = {
                    summary                         = "..."
                    description                     = "..."
                    x-amazon-apigateway-integration = {
                        httpMethod           = "GET"
                        payloadFormatVersion = var.api-gateway-version
                        type                 = "HTTP_PROXY"
                        uri                  = "https://ip-ranges.amazonaws.com/ip-ranges.json"

                        request_models = {
                            "application/json" = local.models.ip
                        }
                    }
                }

                options = {
                    summary                         = "..."
                    description                     = "..."
                    x-amazon-apigateway-integration = {
                        type       = "mock"
                        httpMethod = null
                        uri        = null

                        responses = {
                            default = {
                                statusCode         = "200"
                                responseParameters = {
                                    "method.response.header.Access-Control-Allow-Methods" = "'*'"
                                    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
                                    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
                                }
                                responseTemplates = {
                                    "application/json" = jsonencode({ "Preflight-Response" : "Successful" })
                                }
                            }
                        }
                        requestTemplates = {
                            "application/json" = jsonencode({ "statusCode" : 200 })
                        }

                        passthroughBehavior = "when_no_match"

                        timeoutInMillis = 29000
                    }

                    responses = {
                        200 = {
                            description = "Successful HTTP CORS Response"
                            headers     = {
                                Access-Control-Allow-Origin = {
                                    schema = {
                                        type = "string"
                                    }
                                }

                                Access-Control-Allow-Methods = {
                                    schema = {
                                        type = "string"
                                    }
                                }

                                Access-Control-Allow-Headers = {
                                    schema = {
                                        type = "string"
                                    }
                                }
                            }

                            content = {}
                        }
                    }
                }
            }
        }

        x-amazon-apigateway-documentation = {
            version            = "0.0.1"
            documentationParts = [
                {
                    location = {
                        type = "API"
                    }
                    properties = {
                        description = "[API Description ...]"
                        info        = {
                            description = "[API Description ...]"
                            version     = "[API Description ...]"
                        }
                    }
                }, {
                    "location" : {
                        type   = "METHOD"
                        method = "POST"
                    }
                    properties = {
                        description = "[Method Description ...]"
                    }
                }, {
                    location = {
                        type = "MODEL"
                        name = "Empty"
                    }, properties = {
                        title = "Empty Schema"
                    }
                }, {
                    location = {
                        type       = "RESPONSE"
                        method     = "GET"
                        statusCode = "200"
                    }, properties = {
                        description = "200 Response"
                    }
                }
            ]
        }

        x-amazon-apigateway-request-validators = {
            "Validate query string parameters and headers" = {
                validateRequestParameters = false
                validateRequestBody       = false
            }
        }

        x-amazon-apigateway-tag-value = {
            Staging-Area = title(var.stage)
        }

        x-amazon-apigateway-importexport-version = "1.0"
    })

    name = var.api-gateway-name

    endpoint_configuration {
        types = [
            var.api-gateway-type
        ]
    }
}

resource "aws_api_gateway_method_settings" "method-settings" {
    rest_api_id = aws_api_gateway_rest_api.rest-api-gateway.id
    stage_name  = aws_api_gateway_stage.stage.stage_name
    method_path = "*/*"

    settings {
        metrics_enabled = true
    }
}

resource "aws_api_gateway_model" "ip-range-model" {
    content_type = "Application/JSON"
    name         = local.models.ip
    rest_api_id  = aws_api_gateway_rest_api.rest-api-gateway.id
    description  = "All AWS IP Ranges"
    schema       = jsonencode({
        "type" : "object",
        "description" : "...",
        "properties" : {
            "syncToken" : { "type" : "string" },
            "createDate" : { "type" : "string" },
            "prefixes" : {
                "type" : "array",
                "items" : {
                    "type" : "object",
                    "properties" : {
                        "ip_prefix" : { "type" : "string" }
                        "region" : { "type" : "string" }
                        "service" : { "type" : "string" }
                        "network_border_group" : { "type" : "string" }
                    }
                }
            }
        },
        "additionalProperties" : false
    })
}

resource "aws_api_gateway_deployment" "deployment" {
    rest_api_id = aws_api_gateway_rest_api.rest-api-gateway.id

    triggers = {
        redeployment = sha1(jsonencode(aws_api_gateway_rest_api.rest-api-gateway.body))
    }

    lifecycle {
        create_before_destroy = true
    }
}

resource "aws_api_gateway_stage" "stage" {
    deployment_id = aws_api_gateway_deployment.deployment.id
    rest_api_id   = aws_api_gateway_rest_api.rest-api-gateway.id
    stage_name    = var.stage
}

output "api-gateway-id" {
    description = "Can be Optionally used when defining AWS Lambda Proxies Downstream"
    value       = aws_api_gateway_rest_api.rest-api-gateway.id
}

output "api-gateway-name" {
    description = "Can be Optionally used when defining AWS Lambda Proxy Data Sources Downstream"
    value       = aws_api_gateway_rest_api.rest-api-gateway.name
}

/*** Allows Full ARN Resolution including Account, Regions, Identifiers */
data "aws_arn" "execution-arn" {
    arn = aws_api_gateway_deployment.deployment.execution_arn
}

output "api-gateway-execution-arn" {
    description = "Can be Optionally used when defining AWS Lambda Proxy Data Sources Downstream"
    value       = data.aws_arn.execution-arn.arn
}
