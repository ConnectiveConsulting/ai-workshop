# Create Resource Group
resource "azurerm_resource_group" "sql" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# Generate a random suffix for unique naming
resource "random_string" "suffix" {
  length  = 8
  special = false
  upper   = false
}

# Create SQL Server
resource "azurerm_mssql_server" "sql_server" {
  name                         = "${var.sql_server_name}-${random_string.suffix.result}"
  resource_group_name          = azurerm_resource_group.sql.name
  location                     = azurerm_resource_group.sql.location
  version                      = "12.0"
  administrator_login          = var.sql_admin_login
  administrator_login_password = var.sql_admin_password
  
  tags = var.tags
}

# Create firewall rule to allow all IPs (0.0.0.0 to 255.255.255.255)
resource "azurerm_mssql_firewall_rule" "allow_all" {
  name             = "AllowAllIPs"
  server_id        = azurerm_mssql_server.sql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "255.255.255.255"
}

# Allow Azure services to access the server
resource "azurerm_mssql_firewall_rule" "allow_azure_services" {
  name             = "AllowAzureServices"
  server_id        = azurerm_mssql_server.sql_server.id
  start_ip_address = "0.0.0.0"
  end_ip_address   = "0.0.0.0"
}

# Create SQL Database
resource "azurerm_mssql_database" "pokedex" {
  name           = var.database_name
  server_id      = azurerm_mssql_server.sql_server.id
  collation      = "SQL_Latin1_General_CP1_CI_AS"
  sku_name       = var.database_sku
  zone_redundant = false

  tags = var.tags
}
