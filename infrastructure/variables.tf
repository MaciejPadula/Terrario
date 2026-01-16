# Variables
variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "location" {
  description = "Azure region"
  type        = string
  default     = "West Europe"
}

variable "project_name" {
  description = "Project name"
  type        = string
  default     = "terrario"
}

variable "subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "sql_admin_username" {
  description = "SQL Server administrator username"
  type        = string
  default     = "sqladmin"
}

variable "sql_admin_password" {
  description = "SQL Server administrator password"
  type        = string
  sensitive   = true
}

variable "jwt_secret_key" {
  description = "JWT Secret Key for authentication"
  type        = string
  sensitive   = true
}

variable "jwt_issuer" {
  description = "JWT Issuer"
  type        = string
  default     = "TerrariaAPI"
}

variable "jwt_audience" {
  description = "JWT Audience"
  type        = string
  default     = "TerrariaClient"
}