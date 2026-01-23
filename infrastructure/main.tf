terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  subscription_id = var.subscription_id
  features {
    resource_group {
      prevent_deletion_if_contains_resources = false
    }
  }
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
      dotnet_version = "10.0"
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
    
    # Azure Blob Storage Settings
    "AzureBlobStorage__ConnectionString"      = azurerm_storage_account.images.primary_connection_string
    "AzureBlobStorage__ContainerName"         = azurerm_storage_container.animal_images.name
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

# Storage Account for Animal Images
resource "azurerm_storage_account" "images" {
  name                     = "${replace(local.resource_prefix, "-", "")}img" # Storage account names must be globally unique and lowercase without hyphens
  resource_group_name      = azurerm_resource_group.main.name
  location                 = azurerm_resource_group.main.location
  account_tier             = "Standard"
  account_replication_type = "LRS" # Locally redundant storage, upgrade to GRS for production
  account_kind             = "StorageV2"
  min_tls_version          = "TLS1_2"
  
  blob_properties {
    cors_rule {
      allowed_headers    = ["*"]
      allowed_methods    = ["GET", "HEAD"]
      allowed_origins    = ["*"] # Restrict this to your frontend domain in production
      exposed_headers    = ["*"]
      max_age_in_seconds = 3600
    }
  }
  
  tags = local.tags
}

# Storage Container for Animal Images
resource "azurerm_storage_container" "animal_images" {
  name                  = "animal-images"
  storage_account_id    = azurerm_storage_account.images.id
  container_access_type = "private" # Images served through API, not directly
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

output "storage_account_name" {
  description = "Storage Account name for animal images"
  value       = azurerm_storage_account.images.name
}

output "storage_container_name" {
  description = "Storage Container name for animal images"
  value       = azurerm_storage_container.animal_images.name
}

output "storage_connection_string" {
  description = "Storage Account connection string"
  value       = azurerm_storage_account.images.primary_connection_string
  sensitive   = true
}
