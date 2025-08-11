param (
    [string]$workshop_directory,
    [string]$workshop_git_repo_url
)
Set-ExecutionPolicy Unrestricted -Force;
# Create workshop directory
New-Item -Path $workshop_directory -ItemType Directory -Force;

# Install Git if needed for repository cloning
if ($workshop_git_repo_url -ne '') {
    # Check if Git is installed
    if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    # Install Chocolatey
    Set-ExecutionPolicy Bypass -Scope Process -Force;
    [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072;
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'));
    
    # Install Git using Chocolatey
    choco install git -y;
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User');
    }
    
    # Clone the repository
    cd $workshop_directory;
    git clone $workshop_git_repo_url .;
}
