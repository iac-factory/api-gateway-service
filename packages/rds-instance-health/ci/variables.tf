variable "name" {
    description = "Resource Endpoint Partition for Invocation of Lambda Function from API Gateway"
    type        = string
}

variable "security-group-name" {
    description = "AWS RDS, or Lambda-Related, Security Group"
    type        = string
}

variable "subnets" {
    description = "VPC Subnet IDs - If Security Group is Specified, VPC + Subnet(s) are Derived from Associated Security-Group Origin"
    type    = list(string)
    default = null
}

variable "api-gateway" {
    description = "API Gateway Name (Display, Common-Name)"
    type = string
}

variable "api-gateway-method" {
    type    = string
    default = "GET"
}

variable "api-gateway-path" {
    type    = string
}

variable "handler" {
    description = "Lambda Function Source Export Handler"
    type        = string
    default     = "index.handler"
}

variable "description" {
    description = "Lambda Function Description"
    type        = string
    default     = "..."
}

variable "timeout" {
    description = "Runtime Timeout (Seconds) - Defaults to 30 Seconds"
    type        = number
    default     = 30
}

variable "memory-size" {
    description = "Runtime Memory Allocation (MB) - Defaults to 256"
    type        = number
    default     = 256
}

variable "environment-variables" {
    description = "Runtime Environment Configuration"
    type        = map(string)
    default     = {}
}

variable "runtime" {
    description = "Runtime Language + Version"
    type        = string
    default     = "nodejs14.x"
}

variable "url" {
    type    = bool
    default = false
}

variable "environment" {
    default = "Development"
}