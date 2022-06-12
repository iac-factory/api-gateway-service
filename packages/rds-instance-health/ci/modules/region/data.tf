data "aws_region" "current-region" {}
data "aws_regions" "regions" {
    all_regions = true
}