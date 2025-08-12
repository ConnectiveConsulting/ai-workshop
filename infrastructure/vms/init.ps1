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

# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force;
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'));

# Install Visual Studio Code
choco install vscode -y

# Install Chrome and make it the default browser
choco install googlechrome -y
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice" -Name "ProgId" -Value "ChromeHTML"

# Install Firefox and make it the default browser
#choco install firefox -y
#Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice" -Name "ProgId" -Value "FirefoxURL"