data "template_file" "init_script" {
    template = "${file("init.ps1")}"
    vars = {
        workshop_directory    = "${var.workshop_directory}"
        workshop_git_repo_url = "${var.workshop_git_repo_url}"
  }
}

# Resource Group
resource "azurerm_resource_group" "workshop_rg" {
  name     = var.resource_group_name
  location = var.location
  tags     = var.tags
}

# Network Security Group
resource "azurerm_network_security_group" "workshop_nsg" {
  name                = var.nsg_name
  location            = azurerm_resource_group.workshop_rg.location
  resource_group_name = azurerm_resource_group.workshop_rg.name
  tags                = var.tags

  # Allow RDP access
  security_rule {
    name                       = "AllowRDP"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "3389"
    source_address_prefix      = "*"
    destination_address_prefix = "*"
  }
}

# Virtual Network
resource "azurerm_virtual_network" "workshop_vnet" {
  name                = var.vnet_name
  address_space       = var.vnet_address_space
  location            = azurerm_resource_group.workshop_rg.location
  resource_group_name = azurerm_resource_group.workshop_rg.name
  tags                = var.tags
}

# Subnet
resource "azurerm_subnet" "workshop_subnet" {
  name                 = var.subnet_name
  resource_group_name  = azurerm_resource_group.workshop_rg.name
  virtual_network_name = azurerm_virtual_network.workshop_vnet.name
  address_prefixes     = [var.subnet_address_prefix]
}

# Associate NSG with Subnet
resource "azurerm_subnet_network_security_group_association" "workshop_subnet_nsg" {
  subnet_id                 = azurerm_subnet.workshop_subnet.id
  network_security_group_id = azurerm_network_security_group.workshop_nsg.id
}

# Public IPs for VMs
resource "azurerm_public_ip" "workshop_vm_pip" {
  count               = var.vm_count
  name                = "${var.vm_name_prefix}-${count.index + 1}-pip"
  location            = azurerm_resource_group.workshop_rg.location
  resource_group_name = azurerm_resource_group.workshop_rg.name
  allocation_method   = "Static"
  sku                 = "Standard"
  tags                = var.tags
}

# Network Interfaces for VMs
resource "azurerm_network_interface" "workshop_vm_nic" {
  count               = var.vm_count
  name                = "${var.vm_name_prefix}-${count.index + 1}-nic"
  location            = azurerm_resource_group.workshop_rg.location
  resource_group_name = azurerm_resource_group.workshop_rg.name
  tags                = var.tags

  ip_configuration {
    name                          = "internal"
    subnet_id                     = azurerm_subnet.workshop_subnet.id
    private_ip_address_allocation = "Dynamic"
    public_ip_address_id          = azurerm_public_ip.workshop_vm_pip[count.index].id
  }
}

# Virtual Machines with Visual Studio 2022
resource "azurerm_windows_virtual_machine" "workshop_vm" {
  count               = var.vm_count
  name                = "${var.vm_name_prefix}-${count.index + 1}"
  location            = azurerm_resource_group.workshop_rg.location
  resource_group_name = azurerm_resource_group.workshop_rg.name
  size                = var.vm_size
  admin_username      = var.admin_username
  admin_password      = var.admin_password
  tags                = var.tags

  network_interface_ids = [
    azurerm_network_interface.workshop_vm_nic[count.index].id
  ]

  os_disk {
    name                 = "${var.vm_name_prefix}-${count.index + 1}-osdisk"
    caching              = "ReadWrite"
    storage_account_type = "Premium_LRS"
    disk_size_gb         = 256  # Visual Studio needs more disk space
  }

  # Visual Studio 2022 on Windows Server 2022
  source_image_reference {
    publisher = "microsoftvisualstudio"
    offer     = "visualstudioplustools"
    sku       = "vs-2022-comm-general-win11-m365-gen2"
    version   = "latest"
  }

  # Enable auto-update and configure Windows features
  additional_capabilities {
    ultra_ssd_enabled = false
  }

  # Boot diagnostics
  boot_diagnostics {
    storage_account_uri = null  # Use managed storage account
  }

  # Windows VM specific settings
  patch_mode            = "AutomaticByOS"
  enable_automatic_updates = true
  timezone              = "UTC"
}

# Add extension to prepare the VM for workshop use
resource "azurerm_virtual_machine_extension" "workshop_vm_extension" {
  count                = var.vm_count
  name                 = "PrepareWorkshopVM"
  virtual_machine_id   = azurerm_windows_virtual_machine.workshop_vm[count.index].id
  publisher            = "Microsoft.Compute"
  type                 = "CustomScriptExtension"
  type_handler_version = "1.9"
  depends_on           = [ azurerm_windows_virtual_machine.workshop_vm ]

  protected_settings = <<SETTINGS
  {
    "commandToExecute": "powershell -command \"[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String('${base64encode(data.template_file.init_script.rendered)}')) | Out-File -filepath init.ps1\" && powershell -ExecutionPolicy Unrestricted -File init.ps1 -workshop_directory ${replace(data.template_file.init_script.vars.workshop_directory, "\\", "\\\\")} -workshop_git_repo_url ${data.template_file.init_script.vars.workshop_git_repo_url}"
  }
  SETTINGS

  tags = var.tags
}