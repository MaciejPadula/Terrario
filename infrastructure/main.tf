terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
}

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

# Locals
locals {
  resource_prefix = "${var.project_name}-${var.environment}"
  tags = {
    Environment = var.environment
    Project     = var.project_name
    ManagedBy   = "Terraform"
  }
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "${local.resource_prefix}-rg"
  location = var.location
  tags     = local.tags
}

# App Service Plan (Linux)
resource "azurerm_service_plan" "main" {
  name                = "${local.resource_prefix}-asp"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  os_type             = "Linux"
  sku_name            = "B1" # Basic tier, upgrade to P1V2 for production
  tags                = local.tags
}

# App Service for Backend API + Frontend
resource "azurerm_linux_web_app" "main" {
  name                = "${local.resource_prefix}-app"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  service_plan_id     = azurerm_service_plan.main.id
  https_only          = true
  tags                = local.tags

  site_config {
    always_on = true
    
    application_stack {
      dotnet_version = "8.0"
    }

    # SPA fallback to index.html for client-side routing
    default_documents = ["index.html"]
  }

  app_settings = {
    "ASPNETCORE_ENVIRONMENT"                    = var.environment == "prod" ? "Production" : "Development"
    "WEBSITE_RUN_FROM_PACKAGE"                  = "1"
    "APPLICATIONINSIGHTS_CONNECTION_STRING"     = azurerm_application_insights.main.connection_string
    "ApplicationInsightsAgent_EXTENSION_VERSION" = "~3"
    
    # JWT Settings
    "JwtSettings__SecretKey"       = var.jwt_secret_key
    "JwtSettings__Issuer"          = var.jwt_issuer
    "JwtSettings__Audience"        = var.jwt_audience
    "JwtSettings__ExpirationHours" = "24"
  }

  connection_string {
    name  = "DefaultConnection"
    type  = "SQLAzure"
    value = "Server=tcp:${azurerm_mssql_server.main.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.main.name};Persist Security Info=False;User ID=${var.sql_admin_username};Password=${var.sql_admin_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }

  identity {
    type = "SystemAssigned"
  }
}

# SQL Server
resource "azurerm_mssql_server" "main" {
  name                         = "${local.resource_prefix}-sqlserver"
  location                     = azurerm_resource_group.main.location
  resource_group_name          = azurerm_resource_group.main.name
  version                      = "12.0"
  administrator_login          = var.sql_admin_username
  administrator_login_password = var.sql_admin_password
  minimum_tls_version          = "1.2"
  tags                         = local.tags

  azuread_administrator {
    login_username = "AzureAD Admin"
    object_id      = data.azurerm_client_config.current.object_id
  }
}

# SQL Database
resource "azurerm_mssql_database" "main" {
  name                = "${local.resource_prefix}-db"
  server_id           = azurerm_mssql_server.main.id
  collation           = "SQL_Latin1_General_CP1_CI_AS"
  max_size_gb         = 2
  sku_name            = "Basic" # Upgrade to S0 or higher for production
  zone_redundant      = false
  tags                = local.tags
}

# SQL Firewall Rule - Allow Azure Services
resource "azurerm_mssql_firewall_rule" "allow_azure" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.main.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# SQL Firewall Rule - Allow Your IP (optional, for development)
# Uncomment and set your IP address
# resource "azurerm_mssql_firewall_rule" "allow_my_ip" {
#   name             = "AllowMyIP"
#   server_id        = azurerm_mssql_server.main.id
#   start_ip_address = "YOUR_PUBLIC_IP"
#   end_ip_address   = "YOUR_PUBLIC_IP"
# }

# Application Insights
resource "azurerm_log_analytics_workspace" "main" {
  name                = "${local.resource_prefix}-law"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
  tags                = local.tags
}

resource "azurerm_application_insights" "main" {
  name                = "${local.resource_prefix}-ai"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  workspace_id        = azurerm_log_analytics_workspace.main.id
  application_type    = "web"
  tags                = local.tags
}

# Data source for current Azure configuration
data "azurerm_client_config" "current" {}

# Outputs
output "resource_group_name" {
  description = "Resource Group name"
  value       = azurerm_resource_group.main.name
}

output "app_url" {
  description = "Application URL (Frontend + Backend)"
  value       = "https://${azurerm_linux_web_app.main.default_hostname}"
}

output "app_name" {
  description = "App Service name"
  value       = azurerm_linux_web_app.main.name
}

output "sql_server_fqdn" {
  description = "SQL Server FQDN"
  value       = azurerm_mssql_server.main.fully_qualified_domain_name
}

output "sql_database_name" {
  description = "SQL Database name"
  value       = azurerm_mssql_database.main.name
}

output "application_insights_instrumentation_key" {
  description = "Application Insights instrumentation key"
  value       = azurerm_application_insights.main.instrumentation_key
  sensitive   = true
}

output "application_insights_connection_string" {
  description = "Application Insights connection string"
  value       = azurerm_application_insights.main.connection_string
  sensitive   = true
}
