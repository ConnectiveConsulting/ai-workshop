<#
.SYNOPSIS
    Starts or stops Azure VMs in the ai-workshop-rg resource group with names matching vs2022-vm-*

.DESCRIPTION
    This script gets all Azure VMs in the specified resource group with names matching the pattern vs2022-vm-*
    and either starts or stops them based on the provided action parameter.

.PARAMETER Action
    The action to perform on the VMs. Valid values are 'Start' or 'Stop'.

.EXAMPLE
    .\Manage-AzureVMs.ps1 -Action Start
    Starts all VMs with names matching vs2022-vm-* in the ai-workshop-rg resource group.

.EXAMPLE
    .\Manage-AzureVMs.ps1 -Action Stop
    Stops all VMs with names matching vs2022-vm-* in the ai-workshop-rg resource group.
#>

[CmdletBinding()]
param (
    [Parameter(Mandatory = $true)]
    [ValidateSet('Start', 'Stop')]
    [string]$Action
)

# Resource group name
$resourceGroupName = "ai-workshop-rg"
# VM name pattern
$vmNamePattern = "vs2022-vm-*"

# Function to check if Az module is installed and login if needed
function Ensure-AzureConnection {
    # Check if Az module is installed
    if (-not (Get-Module -ListAvailable -Name Az.Compute)) {
        Write-Host "Az.Compute module not found. Installing..." -ForegroundColor Yellow
        try {
            Install-Module -Name Az.Compute -Scope CurrentUser -Force -ErrorAction Stop
        }
        catch {
            Write-Error "Failed to install Az.Compute module. Please install it manually using 'Install-Module -Name Az.Compute'."
            exit 1
        }
    }

    # Check if already logged in
    try {
        $context = Get-AzContext -ErrorAction Stop
        if (-not $context.Account) {
            throw "No active Azure context found."
        }
        Write-Host "Already logged in as $($context.Account.Id)" -ForegroundColor Green
    }
    catch {
        Write-Host "Not logged in to Azure. Initiating login..." -ForegroundColor Yellow
        try {
            Connect-AzAccount -ErrorAction Stop
        }
        catch {
            Write-Error "Failed to login to Azure. Please ensure you have the correct credentials."
            exit 1
        }
    }
}

# Function to get all VMs matching the pattern
function Get-TargetVMs {
    param (
        [string]$ResourceGroupName,
        [string]$NamePattern
    )

    try {
        $vms = Get-AzVM -ResourceGroupName $ResourceGroupName -ErrorAction Stop | 
               Where-Object { $_.Name -like $NamePattern }
        
        if ($vms.Count -eq 0) {
            Write-Warning "No VMs found matching pattern '$NamePattern' in resource group '$ResourceGroupName'."
            return $null
        }
        
        return $vms
    }
    catch {
        Write-Error "Failed to retrieve VMs: $_"
        return $null
    }
}

# Function to start VMs
function Start-TargetVMs {
    param (
        [array]$VMs
    )

    foreach ($vm in $VMs) {
        Write-Host "Starting VM: $($vm.Name)..." -ForegroundColor Cyan
        try {
            $result = Start-AzVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name -ErrorAction Stop
            if ($result.Status -eq "Succeeded") {
                Write-Host "Successfully started VM: $($vm.Name)" -ForegroundColor Green
            }
            else {
                Write-Warning "Operation completed but status is: $($result.Status) for VM: $($vm.Name)"
            }
        }
        catch {
            Write-Error "Failed to start VM $($vm.Name): $_"
        }
    }
}

# Function to stop VMs
function Stop-TargetVMs {
    param (
        [array]$VMs
    )

    foreach ($vm in $VMs) {
        Write-Host "Stopping VM: $($vm.Name)..." -ForegroundColor Cyan
        try {
            $result = Stop-AzVM -ResourceGroupName $vm.ResourceGroupName -Name $vm.Name -Force -ErrorAction Stop
            if ($result.Status -eq "Succeeded") {
                Write-Host "Successfully stopped VM: $($vm.Name)" -ForegroundColor Green
            }
            else {
                Write-Warning "Operation completed but status is: $($result.Status) for VM: $($vm.Name)"
            }
        }
        catch {
            Write-Error "Failed to stop VM $($vm.Name): $_"
        }
    }
}

# Main script execution
try {
    # Ensure we're connected to Azure
    Ensure-AzureConnection

    # Get all VMs matching the pattern
    $vms = Get-TargetVMs -ResourceGroupName $resourceGroupName -NamePattern $vmNamePattern
    
    if ($null -eq $vms) {
        exit 1
    }
    
    Write-Host "Found $($vms.Count) VMs matching pattern '$vmNamePattern' in resource group '$resourceGroupName':" -ForegroundColor Green
    $vms | ForEach-Object { Write-Host "  - $($_.Name)" }
    
    # Perform the requested action
    switch ($Action) {
        'Start' {
            Write-Host "`nStarting all VMs..." -ForegroundColor Yellow
            Start-TargetVMs -VMs $vms
        }
        'Stop' {
            Write-Host "`nStopping all VMs..." -ForegroundColor Yellow
            Stop-TargetVMs -VMs $vms
        }
    }
    
    Write-Host "`nOperation completed successfully." -ForegroundColor Green
}
catch {
    Write-Error "An unexpected error occurred: $_"
    exit 1
}