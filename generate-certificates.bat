@echo off
REM Certificate Generation Script for SmokeLOG iOS
REM Run this in Windows to generate required certificate files

echo ============================================
echo SmokeLOG Certificate Generation Helper
echo ============================================
echo.

REM Check if OpenSSL is available
where openssl >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: OpenSSL not found!
    echo.
    echo Please install OpenSSL:
    echo   Option 1: Install Git for Windows (includes OpenSSL)
    echo   Option 2: Download from https://slproweb.com/products/Win32OpenSSL.html
    echo.
    pause
    exit /b 1
)

echo OpenSSL found! Proceeding with certificate generation...
echo.

REM Get user email
set /p USER_EMAIL="Enter your Apple Developer email: "

REM Generate private key and CSR
echo.
echo [Step 1/3] Generating private key and Certificate Signing Request...
openssl req -new -newkey rsa:2048 -nodes -out SmokeLOG.csr -keyout SmokeLOG.key -subj "/emailAddress=%USER_EMAIL%/CN=SmokeLOG Distribution/C=US"

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to generate CSR!
    pause
    exit /b 1
)

echo SUCCESS! Created:
echo   - SmokeLOG.csr (upload to Apple)
echo   - SmokeLOG.key (keep safe, need for .p12)
echo.

echo [Step 2/3] Next steps:
echo   1. Go to: https://developer.apple.com/account/resources/certificates
echo   2. Click '+' and select 'Apple Distribution'
echo   3. Upload the SmokeLOG.csr file
echo   4. Download the certificate and save as 'distribution.cer' in this folder
echo.
echo Press any key when you have downloaded distribution.cer...
pause >nul

REM Check if distribution.cer exists
if not exist distribution.cer (
    echo ERROR: distribution.cer not found in current directory!
    echo Please download it from Apple and try again.
    pause
    exit /b 1
)

echo.
echo [Step 3/3] Converting certificate to .p12 format...
echo.

REM Convert .cer to .pem
openssl x509 -inform DER -outform PEM -in distribution.cer -out distribution.pem

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to convert certificate!
    pause
    exit /b 1
)

REM Create .p12
echo IMPORTANT: You will be asked to enter a password.
echo This password will be needed in Ionic Appflow!
echo Write it down somewhere safe!
echo.
openssl pkcs12 -export -out distribution.p12 -inkey SmokeLOG.key -in distribution.pem

if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Failed to create .p12!
    pause
    exit /b 1
)

echo.
echo ============================================
echo SUCCESS! Certificate files created:
echo ============================================
echo.
echo Files created:
echo   - SmokeLOG.csr (used, can delete)
echo   - SmokeLOG.key (KEEP SAFE - backup this!)
echo   - distribution.cer (from Apple)
echo   - distribution.pem (intermediate file)
echo   - distribution.p12 (UPLOAD TO APPFLOW)
echo.
echo Next steps:
echo   1. Keep distribution.p12 and the password safe
echo   2. Create Provisioning Profile at Apple Developer
echo   3. Upload both to Ionic Appflow Certificates section
echo.
echo See APPFLOW_QUICKSTART.md for detailed next steps!
echo.
pause
