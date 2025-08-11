# Azure Visual Studio 2022 Workshop VMs

This Terraform configuration creates a dynamic number of Windows virtual machines with Visual Studio 2022 Enterprise pre-installed in Azure. These VMs are intended for workshop environments where students need to remote into development machines.

## Features

- Creates a configurable number of Windows VMs with Visual Studio 2022 Enterprise
- Sets up networking with proper security groups for RDP access
- Configures each VM with a public IP for remote access
- Creates a workshop directory on each VM
- Supports automatic Git repository cloning for workshop materials
- Allows custom PowerShell commands for additional VM setup
- Outputs connection information for easy access

## Prerequisites

- [Terraform](https://www.terraform.io/downloads.html) (v1.0.0 or newer)
- [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli) installed and authenticated
- Azure subscription with permissions to create resources
- Quota for the VM size specified in your Azure subscription

## Usage

1. **Initialize Terraform**:
   ```bash
   terraform init
   ```

2. **Create a terraform.tfvars file** (optional):
   Create a `terraform.tfvars` file to customize variables:
   ```hcl
   resource_group_name = "my-workshop-rg"
   location            = "eastus"
   vm_count            = 5
   admin_username      = "workshopadmin"
   admin_password      = "YourSecurePassword123!"
   
   # Workshop Git repository configuration
   enable_git_clone             = true
   workshop_git_repo_url        = "https://github.com/example/workshop-materials.git"
   workshop_git_repo_branch     = "main"
   workshop_directory           = "C:\\Workshop"
   
   # Additional PowerShell commands to run
   additional_powershell_commands = <<EOF
     # Install additional tools
     choco install vscode -y;
     choco install dotnetcore-sdk -y;
     
     # Configure Git
     git config --global user.name "Workshop User";
     git config --global user.email "workshop@example.com";
   EOF
   ```

3. **Plan the deployment**:
   ```bash
   terraform plan -out=tfplan
   ```

4. **Apply the configuration**:
   ```bash
   terraform apply tfplan
   ```

5. **Access the VMs**:
   After deployment completes, Terraform will output RDP connection strings for each VM.

## Configuration Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `resource_group_name` | Name of the resource group | `workshop-vs2022-rg` |
| `location` | Azure region where resources will be created | `eastus` |
| `vm_count` | Number of Visual Studio 2022 VMs to create | `1` |
| `vm_name_prefix` | Prefix for VM names | `vs2022-vm` |
| `vm_size` | Size of the VM | `Standard_D4s_v3` |
| `admin_username` | Admin username for the VMs | `workshopadmin` |
| `admin_password` | Admin password for the VMs | (required) |
| `vnet_name` | Name of the virtual network | `workshop-vnet` |
| `vnet_address_space` | Address space for the virtual network | `["10.0.0.0/16"]` |
| `subnet_name` | Name of the subnet | `workshop-subnet` |
| `subnet_address_prefix` | Address prefix for the subnet | `10.0.1.0/24` |
| `nsg_name` | Name of the network security group | `workshop-nsg` |
| `tags` | Tags to apply to all resources | `{ Environment = "Workshop", Purpose = "Development" }` |
| `workshop_directory` | Directory path on the VM where workshop files will be stored | `C:\Workshop` |
| `workshop_git_repo_url` | URL of the Git repository to clone for workshop materials | `""` |
| `workshop_git_repo_branch` | Branch of the Git repository to clone | `main` |
| `enable_git_clone` | Whether to clone the Git repository | `false` |
| `additional_powershell_commands` | Additional PowerShell commands to run during VM setup | `""` |

## Outputs

| Output | Description |
|--------|-------------|
| `resource_group_name` | Name of the resource group |
| `resource_group_location` | Location of the resource group |
| `vm_names` | Names of the created VMs |
| `vm_public_ips` | Public IP addresses of the VMs |
| `vm_admin_username` | Admin username for the VMs |
| `rdp_connection_strings` | RDP connection strings for each VM |
| `workshop_ready_message` | Message indicating the workshop environment is ready |

## Notes

- The VMs are configured with RDP access from any IP address. For production use, consider restricting this to specific IP ranges.
- Visual Studio 2022 Enterprise is a licensed product. Ensure you have the appropriate licensing for your workshop.
- The VMs are configured with automatic updates enabled.
- Each VM has a C:\Workshop directory created with a README.txt file for workshop instructions.

## Cleanup

To destroy all resources created by this configuration:

```bash
terraform destroy
```

## Customization

### Git Repository for Workshop Materials

You can automatically clone a Git repository containing workshop materials to each VM by setting the following variables:

```hcl
enable_git_clone      = true
workshop_git_repo_url = "https://github.com/example/workshop-materials.git"
workshop_git_repo_branch = "main"  # Optional, defaults to "main"
```

The repository will be cloned to the directory specified by `workshop_directory` (default: `C:\Workshop`).

### Custom PowerShell Commands

You can run additional PowerShell commands on each VM during setup by setting the `additional_powershell_commands` variable. This allows you to:

- Install additional software
- Configure system settings
- Download additional files
- Set up user preferences

Example:

```hcl
additional_powershell_commands = <<EOF
  # Install additional tools using Chocolatey
  choco install nodejs -y;
  choco install azure-cli -y;
  
  # Download additional files
  Invoke-WebRequest -Uri "https://example.com/files/workshop-guide.pdf" -OutFile "C:\\Workshop\\guide.pdf";
  
  # Create desktop shortcuts
  $WshShell = New-Object -ComObject WScript.Shell;
  $Shortcut = $WshShell.CreateShortcut("C:\\Users\\Public\\Desktop\\Workshop Guide.lnk");
  $Shortcut.TargetPath = "C:\\Workshop\\guide.pdf";
  $Shortcut.Save();
EOF
```

The script automatically installs Git if it's not already installed when `enable_git_clone` is set to `true`.