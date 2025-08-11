variable "resource_group_name" {
  description = "The name of the resource group"
  type        = string
  default     = "ai-workshop-sql-rg"
}

variable "location" {
  description = "The Azure region where resources will be created"
  type        = string
  default     = "East US"
}

variable "sql_server_name" {
  description = "The name of the SQL server"
  type        = string
  default     = "sql-pokedex-server"
}

variable "sql_admin_login" {
  description = "The administrator login for the SQL server"
  type        = string
  default     = "sqladmin"
}

variable "sql_admin_password" {
  description = "The administrator password for the SQL server"
  type        = string
  sensitive   = true
}

variable "database_name" {
  description = "The name of the SQL database"
  type        = string
  default     = "Pokedex"
}

variable "database_sku" {
  description = "The SKU for the SQL database"
  type        = string
  default     = "Basic"
}

variable "tags" {
  description = "A map of tags to assign to the resources"
  type        = map(string)
  default = {
    Environment = "Development"
    Project     = "Pokedex"
    ManagedBy   = "Terraform"
  }
}
