variable "resource_group_name" {
  description = "Name of the resource group"
  type        = string
  default     = "ai-workshop-rg"
}

variable "location" {
  description = "Azure region where resources will be created"
  type        = string
  default     = "eastus"
}

variable "vm_count" {
  description = "Number of Visual Studio 2022 VMs to create"
  type        = number
  validation {
    condition     = var.vm_count > 0
    error_message = "VM count must be greater than 0."
  }
}

variable "vm_name_prefix" {
  description = "Prefix for VM names"
  type        = string
  default     = "vs2022-vm"
}

variable "vm_size" {
  description = "Size of the VM"
  type        = string
  default     = "Standard_D4s_v3"  # 4 vCPUs, 16 GB RAM - recommended for VS2022
}

variable "admin_username" {
  description = "Admin username for the VMs"
  type        = string
  default     = "workshopadmin"
}

variable "admin_password" {
  description = "Admin password for the VMs"
  type        = string
  sensitive   = true
}

variable "vnet_name" {
  description = "Name of the virtual network"
  type        = string
  default     = "workshop-vnet"
}

variable "vnet_address_space" {
  description = "Address space for the virtual network"
  type        = list(string)
  default     = ["10.0.0.0/16"]
}

variable "subnet_name" {
  description = "Name of the subnet"
  type        = string
  default     = "workshop-subnet"
}

variable "subnet_address_prefix" {
  description = "Address prefix for the subnet"
  type        = string
  default     = "10.0.1.0/24"
}

variable "nsg_name" {
  description = "Name of the network security group"
  type        = string
  default     = "workshop-nsg"
}

variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "Workshop"
    Purpose     = "Development"
  }
}

variable "workshop_directory" {
  description = "Directory path on the VM where workshop files will be stored"
  type        = string
  default     = "C:\\Workshop"
}

variable "workshop_git_repo_url" {
  description = "URL of the Git repository to clone for workshop materials"
  type        = string
  default     = "https://github.com/ConnectiveConsulting/ai-workshop.git"
}

variable "workshop_git_repo_branch" {
  description = "Branch of the Git repository to clone"
  type        = string
  default     = "main"
}

variable "additional_powershell_commands" {
  description = "Additional PowerShell commands to run during VM setup"
  type        = string
  default     = ""
}

variable "enable_git_clone" {
  description = "Whether to clone the Git repository"
  type        = bool
  default     = true
}