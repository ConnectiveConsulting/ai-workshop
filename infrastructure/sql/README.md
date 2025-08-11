# Azure SQL Server Terraform Configuration

This Terraform configuration creates an Azure SQL Server with a single database called "Pokedex". The server is configured with SQL authentication and is open to all incoming IPs by default.

## Resources Created

- **Resource Group**: Container for all resources
- **Azure SQL Server**: SQL Server instance with SQL authentication
- **SQL Database**: Single database named "Pokedex"
- **Firewall Rules**: 
  - Allow all IPs (0.0.0.0 to 255.255.255.255)
  - Allow Azure services

## Prerequisites

1. Azure CLI installed and authenticated
2. Terraform installed (>= 1.0)
3. Appropriate Azure permissions to create SQL resources

## Usage

1. **Copy the example variables file**:
   ```bash
   cp terraform.tfvars.example terraform.tfvars
   ```

2. **Edit terraform.tfvars** and set your SQL admin password:
   ```hcl
   sql_admin_password = "YourStrongPassword123!"
   ```

3. **Initialize Terraform**:
   ```bash
   terraform init
   ```

4. **Plan the deployment**:
   ```bash
   terraform plan
   ```

5. **Apply the configuration**:
   ```bash
   terraform apply
   ```

## Configuration Details

### SQL Server
- **Version**: SQL Server 2019 (version 12.0)
- **Authentication**: SQL Server authentication only
- **Admin Login**: `sqladmin` (configurable via variables)
- **Firewall**: Open to all IPs (0.0.0.0-255.255.255.255)

### Database
- **Name**: Pokedex
- **SKU**: Basic (configurable)
- **Collation**: SQL_Latin1_General_CP1_CI_AS

### Security Considerations

⚠️ **Warning**: This configuration opens the SQL Server to all IP addresses. This is suitable for development/demo purposes but should be restricted in production environments.

For production use, consider:
- Restricting firewall rules to specific IP ranges
- Using Azure Active Directory authentication
- Enabling Advanced Data Security
- Implementing network security groups

## Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `resource_group_name` | Resource group name | `rg-sql-demo` | No |
| `location` | Azure region | `East US` | No |
| `sql_server_name` | SQL server name prefix | `sql-pokedex-server` | No |
| `sql_admin_login` | SQL admin username | `sqladmin` | No |
| `sql_admin_password` | SQL admin password | - | **Yes** |
| `database_name` | Database name | `Pokedex` | No |
| `database_sku` | Database SKU | `Basic` | No |
| `tags` | Resource tags | See variables.tf | No |

## Outputs

- `sql_server_name`: The name of the created SQL server
- `sql_server_fqdn`: Fully qualified domain name of the SQL server
- `database_name`: Name of the created database
- `connection_string`: Connection string template (without password)
- `resource_group_name`: Name of the resource group

## Cleanup

To destroy the resources:

```bash
terraform destroy
```

## Connection String

After deployment, you can connect to the database using:

```
Server=tcp:<server_fqdn>,1433;Initial Catalog=Pokedex;Persist Security Info=False;User ID=sqladmin;Password=<your_password>;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

Replace `<server_fqdn>` and `<your_password>` with the actual values from the Terraform outputs and your configured password.
