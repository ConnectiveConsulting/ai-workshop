output "sql_server_name" {
  description = "The name of the SQL server"
  value       = azurerm_mssql_server.sql_server.name
}

output "sql_server_fqdn" {
  description = "The fully qualified domain name of the SQL server"
  value       = azurerm_mssql_server.sql_server.fully_qualified_domain_name
}

output "database_name" {
  description = "The name of the SQL database"
  value       = azurerm_mssql_database.pokedex.name
}

output "connection_string" {
  description = "Connection string for the database (without password)"
  value       = "Server=tcp:${azurerm_mssql_server.sql_server.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.pokedex.name};Persist Security Info=False;User ID=${var.sql_admin_login};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  sensitive   = false
}

output "resource_group_name" {
  description = "The name of the resource group"
  value       = azurerm_resource_group.sql.name
}
