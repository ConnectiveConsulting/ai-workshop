[CmdletBinding()]

param (
    [Parameter(ValuefromPipeline=$true,Mandatory=$true)] [string]$workshop_directory,
    [Parameter(ValuefromPipeline=$true,Mandatory=$true)] [string]$workshop_git_repo_url,
    [Parameter(ValuefromPipeline=$true,Mandatory=$true)] [string]$workshop_project_git_repo_url
)
Set-ExecutionPolicy Unrestricted -Force;

#
# Install software
# 

# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force;
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'));

# Install Visual Studio Code
choco install vscode -y --ignore-checksums

# Install Python
choco install python -y --ignore-checksums

# Install Temurin JDK 21
choco install temurin21jre -y --ignore-checksums

# Install Maven
choco install maven -y --ignore-checksums

# Install NodeJS 20 LTS
choco install nodejs-lts -y --ignore-checksums

# Install Git
choco install git -y --ignore-checksums

# Install GitHub CLI
choco install gh -y --ignore-checksums

# Install GitHub Copilot CLI
choco install github-copilot-cli -y --ignore-checksums

# Install Chrome and make it the default browser
choco install googlechrome -y --ignore-checksums
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice" -Name "ProgId" -Value "ChromeHTML"

#
# Set up projects
#

# Create workshop directories
New-Item -Path $workshop_directory -ItemType Directory -Force;
New-Item -Path "$workshop_directory\exercises" -ItemType Directory -Force;
New-Item -Path "$workshop_directory\project" -ItemType Directory -Force;
    
# Clone the repository
cd $workshop_directory;

cd exercises
git clone $workshop_git_repo_url .;
# Make the directory safe for Git (otherwise users get ownership errors trying to do git commands)
git config --global --add safe.directory C:/Workshop/exercises
# Configure user information
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

cd project
git clone $workshop_project_git_repo_url .;
# Make the directory safe for Git (otherwise users get ownership errors trying to do git commands)
git config --global --add safe.directory C:/Workshop/project
# Configure user information
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Create a desktop shortcut to https://github.com/ConnectiveConsulting/ai-workshop
$shortcutPath = "$env:USERPROFILE\Desktop\AI_Workshop.lnk"
$targetPath = "https://github.com/ConnectiveConsulting/ai-workshop"
$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.Save()

# Init/Build projects
Set-Location C:\Workshop\project\frontend
npm i

