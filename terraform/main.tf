# 1. Security Group (Firewall)
resource "aws_security_group" "mern_sg" {
  name        = "mern-app-sg"
  description = "Security group for MERN Stack Docker deployment"

  # Allow HTTP web traffic
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow Express API traffic
  ingress {
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Allow SSH Management
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound rule (allow all internet access)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "mern-security-group"
    Env  = var.environment
  }
}

# 2. Output server details
output "security_group_id" {
  value       = aws_security_group.mern_sg.id
  description = "The ID of the generated security group"
}
