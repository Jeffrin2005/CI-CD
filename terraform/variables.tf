variable "aws_region" {
  description = "AWS Region for MERN Stack deployment"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "production"
}

variable "instance_type" {
  description = "EC2 Instance type for running Docker & Kubernetes"
  type        = string
  default     = "t2.micro"
}
