
# .SYNOPSIS
#     Starts or stops Azure VMs in the ai-workshop-rg resource group with names matching vs2022-vm-*
#
# .DESCRIPTION
#     This script gets all Azure VMs in the specified resource group with names matching the pattern vs2022-vm-*
#     and either starts or stops them based on the provided action parameter, using Azure CLI (az).
#
# .PARAMETER Action
#     The action to perform on the VMs. Valid values are 'Start' or 'Stop'.
#
# .EXAMPLE
#     .\Manage-AzureVMs.ps1 -Action Start
#     Starts all VMs with names matching vs2022-vm-* in the ai-workshop-rg resource group.
#
# .EXAMPLE
#     .\Manage-AzureVMs.ps1 -Action Stop
#     Stops all VMs with names matching vs2022-vm-* in the ai-workshop-rg resource group.


param (
    [Parameter(Mandatory = $true)]
    [ValidateSet('Start', 'Stop')]
    [string]$Action
)


# Resource group name
$resourceGroupName = "ai-workshop-rg"
# VM name pattern
$vmNamePattern = "vs2022-vm-*"


# Function to check if Azure CLI is installed and login if needed
function Ensure-AzCliConnection {
    if (-not (Get-Command az -ErrorAction SilentlyContinue)) {
        Write-Error "Azure CLI (az) is not installed. Please install it from https://aka.ms/azure-cli."
        exit 1
    }
    $azAccount = az account show 2>$null | ConvertFrom-Json
    if (-not $azAccount) {
        Write-Host "Not logged in to Azure CLI. Initiating login..." -ForegroundColor Yellow
        try {
            az login | Out-Null
        }
        catch {
            Write-Error "Failed to login to Azure CLI. Please ensure you have the correct credentials."
            exit 1
        }
    } else {
        Write-Host "Already logged in as $($azAccount.user.name)" -ForegroundColor Green
    }
}


# Function to get all VMs matching the pattern using az CLI
function Get-TargetVMs {
    param (
        [string]$ResourceGroupName,
        [string]$NamePattern
    )
    try {
        $vmsJson = az vm list --resource-group $ResourceGroupName -o json 2>$null
        $vms = $null
        if ($vmsJson) {
            $vms = $vmsJson | ConvertFrom-Json | Where-Object { $_.name -like $NamePattern }
        }
        if (-not $vms -or $vms.Count -eq 0) {
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


# Function to start VMs using az CLI
function Start-TargetVMs {
    param (
        [array]$VMs
    )
    foreach ($vm in $VMs) {
        Write-Host "Starting VM: $($vm.name)..." -ForegroundColor Cyan
        try {
            $result = az vm start --resource-group $vm.resourceGroup --name $vm.name 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Successfully started VM: $($vm.name)" -ForegroundColor Green
                # Get the public IP address
                $nicId = $vm.networkProfile.networkInterfaces[0].id
                $nic = az network nic show --ids $nicId -o json | ConvertFrom-Json
                $ipConfig = $nic.ipConfigurations[0]
                if ($ipConfig.publicIpAddress) {
                    $publicIpId = $ipConfig.publicIpAddress.id
                    $publicIp = az network public-ip show --ids $publicIpId -o json | ConvertFrom-Json
                    $ipAddress = $publicIp.ipAddress
                    if ($ipAddress) {
                        Write-Host "  Public IP: $ipAddress" -ForegroundColor Magenta
                    } else {
                        Write-Host "  No public IP address assigned." -ForegroundColor DarkYellow
                    }
                } else {
                    Write-Host "  No public IP address assigned." -ForegroundColor DarkYellow
                }
            } else {
                Write-Warning "Failed to start VM: $($vm.name). Details: $result"
            }
        }
        catch {
            Write-Error "Failed to start VM $($vm.name): $_"
        }
    }
}


# Function to stop VMs using az CLI
function Stop-TargetVMs {
    param (
        [array]$VMs
    )
    foreach ($vm in $VMs) {
        Write-Host "Stopping VM: $($vm.name)..." -ForegroundColor Cyan
        try {
            $result = az vm deallocate --resource-group $vm.resourceGroup --name $vm.name 2>&1
            if ($LASTEXITCODE -eq 0) {
                Write-Host "Successfully stopped VM: $($vm.name)" -ForegroundColor Green
            } else {
                Write-Warning "Failed to stop VM: $($vm.name). Details: $result"
            }
        }
        catch {
            Write-Error "Failed to stop VM $($vm.name): $_"
        }
    }
}

# Main script execution
try {
    # Ensure we're connected to Azure CLI
    Ensure-AzCliConnection

    # Get all VMs matching the pattern
    $vms = Get-TargetVMs -ResourceGroupName $resourceGroupName -NamePattern $vmNamePattern
    if ($null -eq $vms) {
        exit 1
    }

    Write-Host "Found $($vms.Count) VMs matching pattern '$vmNamePattern' in resource group '$resourceGroupName':" -ForegroundColor Green
    $vms | ForEach-Object { Write-Host "  - $($_.name)" }

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