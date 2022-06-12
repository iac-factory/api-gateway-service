output "identifier" {
    value = data.aws_region.current-region.id
}

output "description" {
    value = data.aws_region.current-region.description
}

output "endpoint" {
    value = data.aws_region.current-region.endpoint
}

output "current" {
    value = data.aws_region.current-region.name
}

output "all-region-names" {
    value = data.aws_regions.regions.names
}

output "all-regions-total" {
    value = length(data.aws_regions.regions.names)
}

output "all-regions" {
    value = data.aws_regions.regions.all_regions
}