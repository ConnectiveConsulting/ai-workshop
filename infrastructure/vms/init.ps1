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
# Make the directory safe for Git (otherwise users get ownership errors trying to do git commands)
git config --global --add safe.directory C:/Workshop
# Configure user information
git config --global user.email "you@example.com"
git config --global user.name "Your Name"

# Install Chocolatey
Set-ExecutionPolicy Bypass -Scope Process -Force;
[System.Net.ServicePointManager]::SecurityProtocol = [System.Net.SecurityProtocolType]::Tls12;
iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'));

# Install Visual Studio Code
choco install vscode -y --ignore-checksums

# Install SQL Server Management Studio
#choco install sql-server-management-studio -y --ignore-checksums

# Install Chrome and make it the default browser
choco install googlechrome -y --ignore-checksums
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice" -Name "ProgId" -Value "ChromeHTML"

# Install Firefox and make it the default browser
#choco install firefox -y
#Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\Shell\Associations\UrlAssociations\http\UserChoice" -Name "ProgId" -Value "FirefoxURL"

# Install Python
choco install python -y --ignore-checksums

# Install WinGet
$progressPreference = 'silentlyContinue'
Write-Host "Installing WinGet PowerShell module from PSGallery..."
Install-PackageProvider -Name NuGet -Force | Out-Null
Install-Module -Name Microsoft.WinGet.Client -Force -Repository PSGallery | Out-Null
Write-Host "Using Repair-WinGetPackageManager cmdlet to bootstrap WinGet..."
Repair-WinGetPackageManager -AllUsers
Write-Host "Done."

# Install .NET 10 preview
winget install Microsoft.DotNet.SDK.Preview --disable-interactivity --accept-package-agreements --accept-source-agreements

# Create a desktop shortcut to https://github.com/ConnectiveConsulting/ai-workshop
$shortcutPath = "$env:USERPROFILE\Desktop\AI_Workshop.lnk"
$targetPath = "https://github.com/ConnectiveConsulting/ai-workshop"
$WScriptShell = New-Object -ComObject WScript.Shell
$shortcut = $WScriptShell.CreateShortcut($shortcutPath)
$shortcut.TargetPath = $targetPath
$shortcut.Save()

# Init/Build projects
Set-Location C:\Workshop\projects\checklist
npm i
Set-Location C:\Workshop\projects\pokedex\pokedex-frontend
npm i
Set-Location C:\Workshop\exercises\4.1-mcp\mssql-mcp-dotnet\MssqlMcp
dotnet build

# Execute database SQL script
Install-Module -Name SqlServer -Confirm
Invoke-Sqlcmd -InputFile "C:\Workshop\infrastructure\vms\database.sql" -ServerInstance '(localdb)\MSSQLLocalDB'