# Resource Group
output "resource_group_name" {
  description = "Name of the resource group"
  value       = azurerm_resource_group.workshop_rg.name
}

output "resource_group_location" {
  description = "Location of the resource group"
  value       = azurerm_resource_group.workshop_rg.location
}

# VM Information
output "vm_names" {
  description = "Names of the created VMs"
  value       = azurerm_windows_virtual_machine.workshop_vm[*].name
}

output "vm_public_ips" {
  description = "Public IP addresses of the VMs"
  value       = azurerm_public_ip.workshop_vm_pip[*].ip_address
}

output "vm_domain_names" {
  description = "Domain names of the VMs"
  value       = [for i in range(var.vm_count) : "${var.dns_name_label}-${i + 1}.${azurerm_resource_group.workshop_rg.location}.cloudapp.azure.com"]
}

output "vm_admin_username" {
  description = "Admin username for the VMs"
  value       = var.admin_username
  sensitive   = false
}

# RDP Connection Information
output "rdp_connection_strings" {
  description = "RDP connection strings for each VM"
  value = [
    for i in range(var.vm_count) : 
    "mstsc.exe /v:${azurerm_public_ip.workshop_vm_pip[i].ip_address}"
  ]
}

# Workshop Information
output "workshop_ready_message" {
  description = "Message indicating the workshop environment is ready"
  value = <<-EOT
    Workshop environment with ${var.vm_count} Visual Studio 2022 VMs is ready!
    
    To connect to a VM:
    1. Use the RDP connection strings provided above
    2. Login with username: ${var.admin_username} and the password you provided
    3. Visual Studio 2022 is pre-installed on each VM
    
    Each VM has a C:\\Workshop directory with a README.txt file for workshop instructions.
  EOT
}