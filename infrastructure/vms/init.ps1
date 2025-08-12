[CmdletBinding()]

param (
    [Parameter(ValuefromPipeline=$true,Mandatory=$true)] [string]$workshop_directory,
    [Parameter(ValuefromPipeline=$true,Mandatory=$true)] [string]$workshop_git_repo_url
)
Set-ExecutionPolicy Unrestricted -Force;

# Create workshop directory
New-Item -Path $workshop_directory -ItemType Directory -Force;
    
# Clone the repository
cd $workshop_directory;
git clone $workshop_git_repo_url .;

# Install Visual Studio Code
Invoke-WebRequest -Uri "https://code.visualstudio.com/sha/download?build=stable&os=win32-x64-user" -OutFile "$env:TEMP\VSCodeSetup.exe";
Start-Process -FilePath "$env:TEMP\VSCodeSetup.exe" -ArgumentList "/silent" -Wait;
