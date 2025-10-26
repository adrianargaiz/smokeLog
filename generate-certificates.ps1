# Certificate Generation Script for SmokeLOG iOS
# Run this in PowerShell to generate required certificate files

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "SmokeLOG Certificate Generation Helper" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Check if OpenSSL is available
$openssl = Get-Command openssl -ErrorAction SilentlyContinue

if (-not $openssl) {
    Write-Host "ERROR: OpenSSL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install OpenSSL:" -ForegroundColor Yellow
    Write-Host "  Option 1: Install Git for Windows (includes OpenSSL)" -ForegroundColor Yellow
    Write-Host "  Option 2: Download from https://slproweb.com/products/Win32OpenSSL.html" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "OpenSSL found! Proceeding with certificate generation..." -ForegroundColor Green
Write-Host ""

# Get user email
$userEmail = Read-Host "Enter your Apple Developer email"

# Generate private key and CSR
Write-Host ""
Write-Host "[Step 1/3] Generating private key and Certificate Signing Request..." -ForegroundColor Yellow

$subject = "/emailAddress=$userEmail/CN=SmokeLOG Distribution/C=US"
& openssl req -new -newkey rsa:2048 -nodes -out SmokeLOG.csr -keyout SmokeLOG.key -subj $subject

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to generate CSR!" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host "SUCCESS! Created:" -ForegroundColor Green
Write-Host "  - SmokeLOG.csr (upload to Apple)" -ForegroundColor White
Write-Host "  - SmokeLOG.key (keep safe, need for .p12)" -ForegroundColor White
Write-Host ""

Write-Host "[Step 2/3] Next steps:" -ForegroundColor Yellow
Write-Host "  1. Go to: https://developer.apple.com/account/resources/certificates"
Write-Host "  2. Click '+' and select 'Apple Distribution'"
Write-Host "  3. Upload the SmokeLOG.csr file"
Write-Host "  4. Download the certificate and save as 'distribution.cer' in this folder"
Write-Host ""
Write-Host "Press any key when you have downloaded distribution.cer..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Check if distribution.cer exists
if (-not (Test-Path "distribution.cer")) {
    Write-Host "ERROR: distribution.cer not found in current directory!" -ForegroundColor Red
    Write-Host "Please download it from Apple and try again." -ForegroundColor Yellow
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""
Write-Host "[Step 3/3] Converting certificate to .p12 format..." -ForegroundColor Yellow
Write-Host ""

# Convert .cer to .pem
& openssl x509 -inform DER -outform PEM -in distribution.cer -out distribution.pem

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to convert certificate!" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

# Create .p12
Write-Host "IMPORTANT: You will be asked to enter a password." -ForegroundColor Yellow
Write-Host "This password will be needed in Ionic Appflow!" -ForegroundColor Yellow
Write-Host "Write it down somewhere safe!" -ForegroundColor Red
Write-Host ""

& openssl pkcs12 -export -out distribution.p12 -inkey SmokeLOG.key -in distribution.pem

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to create .p12!" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit 1
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "SUCCESS! Certificate files created:" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files created:" -ForegroundColor White
Write-Host "  - SmokeLOG.csr (used, can delete)" -ForegroundColor Gray
Write-Host "  - SmokeLOG.key (KEEP SAFE - backup this!)" -ForegroundColor Red
Write-Host "  - distribution.cer (from Apple)" -ForegroundColor White
Write-Host "  - distribution.pem (intermediate file)" -ForegroundColor Gray
Write-Host "  - distribution.p12 (UPLOAD TO APPFLOW)" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Keep distribution.p12 and the password safe"
Write-Host "  2. Create Provisioning Profile at Apple Developer"
Write-Host "  3. Upload both to Ionic Appflow Certificates section"
Write-Host ""
Write-Host "See APPFLOW_QUICKSTART.md for detailed next steps!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
