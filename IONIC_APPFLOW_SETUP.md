# Ionic Appflow Setup Guide for SmokeLOG iOS Builds

This guide will help you set up Ionic Appflow to build your Capacitor iOS app on Windows and deploy it to your iPhone for testing.

## Overview

- **App**: SmokeLOG - Smoking cessation tracking app
- **Bundle ID**: com.smokelog.app
- **Tech Stack**: React + Capacitor 7.4.3
- **Platform**: Windows (requires cloud Mac builds)
- **Repository**: https://github.com/adrianargaiz/smokeLog
- **Goal**: Build iOS app and install on physical iPhone

---

## Part 1: Ionic Appflow Account Setup

### Step 1: Create Ionic Account (FREE TIER AVAILABLE)

1. Go to https://ionic.io/appflow
2. Click "Start for Free" or "Get Started"
3. Sign up with your email or GitHub account
4. Choose the **Starter Plan (FREE)** which includes:
   - 500 Live Updates per month
   - 1 concurrent native build
   - Community support
   - Perfect for testing and development

### Step 2: Pricing Breakdown

**FREE Starter Plan Includes:**
- Unlimited apps
- 1 concurrent build (builds run one at a time)
- 500 Live Updates/month
- Community support
- GitHub/GitLab/Bitbucket integration

**Paid Plans (Only if you need more):**
- Growth: $89/month - 3 concurrent builds, more automations
- Scale: $249/month - 10 concurrent builds, advanced features

**For your use case**: The FREE plan is perfect for building and testing on your iPhone!

---

## Part 2: Connect Your GitHub Repository

### Step 1: Link Repository to Appflow

1. Log into your Appflow dashboard at https://dashboard.ionicframework.com
2. Click "New App" or "Create App"
3. Choose "Connect a Git Repository"
4. Select "GitHub" as your provider
5. Authorize Ionic Appflow to access your GitHub account
6. Select the repository: **adrianargaiz/smokeLog**
7. Give your app a name: "SmokeLOG"

### Step 2: Configure App Settings

1. After connecting, Appflow will detect your Capacitor configuration
2. Verify the following in your app settings:
   - App ID: `com.smokelog.app`
   - App Name: `SmokeLog`
   - Repository: `https://github.com/adrianargaiz/smokeLog`
   - Branch: `main` (or your preferred branch)

---

## Part 3: Configure iOS Build Settings

### Step 1: Prepare Your Apple Developer Certificates

You'll need to create/download these from your Apple Developer account:

#### A. Distribution Certificate (.p12 file)

1. Go to https://developer.apple.com/account/resources/certificates
2. Click the "+" button to create a certificate
3. Select "Apple Distribution" (for TestFlight and App Store)
4. Follow the steps to create a Certificate Signing Request (CSR):
   - On Windows, you'll need to use OpenSSL or an online CSR generator
   - Alternative: Use https://certificatesigningrequest.com/
5. Upload the CSR and download your certificate (.cer file)
6. Convert to .p12 format using OpenSSL (see commands below)

**OpenSSL Commands (Windows PowerShell or Git Bash):**

```bash
# Generate private key and CSR
openssl req -new -newkey rsa:2048 -nodes -out SmokeLOG.csr -keyout SmokeLOG.key -subj "/emailAddress=your@email.com/CN=SmokeLOG/C=US"

# After downloading the .cer from Apple, convert to .p12
openssl x509 -inform DER -outform PEM -in distribution.cer -out distribution.pem
openssl pkcs12 -export -out distribution.p12 -inkey SmokeLOG.key -in distribution.pem
```

**Set a password when creating the .p12 file - you'll need it for Appflow!**

#### B. Provisioning Profile (.mobileprovision file)

1. Go to https://developer.apple.com/account/resources/profiles
2. Click "+" to create a new profile
3. Select "Ad Hoc" (for testing on specific devices) or "App Store" (for TestFlight)
4. Choose your App ID: `com.smokelog.app`
5. Select the distribution certificate you just created
6. **For Ad Hoc**: Select your iPhone's UDID
   - Get UDID from iTunes or Finder when iPhone is connected
   - Or use online tools: https://www.whatismyudid.com/
7. Give it a name (e.g., "SmokeLOG Ad Hoc") and download the .mobileprovision file

### Step 2: Upload Certificates to Appflow

1. In Appflow dashboard, go to your app's settings
2. Navigate to "Certificates" section (in the left sidebar)
3. Click "Add Certificate"
4. Upload your files:
   - **Certificate**: Upload the .p12 file
   - **Password**: Enter the password you set for the .p12
   - **Provisioning Profile**: Upload the .mobileprovision file
5. Name this credential set (e.g., "iOS Distribution")

### Step 3: Configure Build Settings

1. Go to "Builds" in the Appflow dashboard
2. Click "New Build"
3. Configure your build:
   - **Platform**: iOS
   - **Type**: Ad Hoc (for testing) or App Store (for TestFlight)
   - **Certificate**: Select the certificate set you uploaded
   - **Target Branch**: main
   - **Build Stack**: Latest (automatically selected)

---

## Part 4: Create Your First Build

### Step 1: Ensure Your Code is Pushed

Make sure all your latest changes are committed and pushed to GitHub:

```bash
cd C:\Proyectos\smokelog
git add .
git commit -m "Prepare for Appflow build"
git push origin main
```

### Step 2: Trigger a Build

1. In Appflow dashboard, go to "Builds"
2. Click "New Build" or "Start Build"
3. Select:
   - **Commit**: Latest commit from main branch
   - **Environment**: Production
   - **Platform**: iOS
   - **Type**: Ad Hoc (recommended for first test)
   - **Certificate**: Your iOS certificate set
4. Click "Submit Build"

### Step 3: Monitor the Build

1. The build will take 5-15 minutes
2. Watch the build logs in real-time
3. Common issues and fixes:
   - **npm install fails**: Check package.json for issues
   - **Build fails**: Check build logs for specific errors
   - **Certificate errors**: Verify certificate and profile match

### Step 4: Download Your IPA

Once the build succeeds:

1. Click "Download" next to the successful build
2. Save the .ipa file to your computer
3. This .ipa can be installed on your iPhone

---

## Part 5: Install on Your iPhone

### Method 1: Direct Installation via iTunes/Finder (Ad Hoc builds)

1. Connect your iPhone to your computer via USB
2. Open iTunes (Windows) or Finder (if you had a Mac)
3. **For Windows iTunes**:
   - Click on your iPhone icon
   - Go to "File" > "Add File to Library"
   - Select your .ipa file
   - Drag the app to your iPhone in the sidebar
4. The app will install and appear on your home screen

### Method 2: Using TestFlight (Recommended for ongoing testing)

This requires an App Store build type instead of Ad Hoc.

1. **Upload to App Store Connect**:
   - Go to https://appstoreconnect.apple.com
   - Select your app or create a new app entry
   - Go to TestFlight tab
   - Upload your .ipa file using Transporter app (download from Microsoft Store)

2. **Add Yourself as a Tester**:
   - In TestFlight section, add your email as an internal tester
   - You'll receive an email invitation

3. **Install TestFlight App**:
   - Download TestFlight from App Store on your iPhone
   - Open the invitation email on your iPhone
   - Click "View in TestFlight"
   - Install SmokeLOG from TestFlight

### Method 3: Using Third-Party Tools (Easiest for Windows)

**Option A: Diawi (Free, Easy)**

1. Go to https://www.diawi.com/
2. Upload your .ipa file
3. Share the generated link to your iPhone
4. Open the link on your iPhone and install
5. Trust the certificate in Settings > General > Device Management

**Option B: Install on Air**

1. Go to https://www.installonair.com/
2. Upload your .ipa file
3. Scan the QR code with your iPhone
4. Follow installation instructions

**Note**: For Ad Hoc builds, your iPhone's UDID must be in the provisioning profile!

---

## Part 6: Appflow Build Automation (Optional)

### Automatic Builds on Git Push

1. In Appflow dashboard, go to "Automations"
2. Click "New Automation"
3. Configure:
   - **Trigger**: When a commit is pushed to main
   - **Action**: Build iOS Ad Hoc
   - **Certificate**: Your iOS certificate
4. Save automation

Now every push to main will automatically trigger a build!

---

## Part 7: Alternative - GitHub Actions (Backup Plan)

If you find Appflow limiting or need more control, here's a free alternative using GitHub Actions:

### Advantages of GitHub Actions:
- Completely free for public repos
- 2,000 minutes/month for private repos
- More control over build process
- Can use Fastlane for automation

### Disadvantages:
- More complex setup
- Requires managing secrets
- Need to set up Fastlane scripts
- Longer initial configuration time

I can provide a complete GitHub Actions setup if needed, but Appflow is recommended for simplicity.

---

## Quick Reference Commands

### Install Ionic CLI (Already Done)
```bash
npm install -g @ionic/cli
```

### Check Ionic Version
```bash
ionic --version
```

### Link to Appflow (After creating account)
```bash
cd C:\Proyectos\smokelog
ionic link
```

### View Builds from CLI
```bash
ionic build list
```

### Trigger Build from CLI
```bash
ionic build ios --commit=main
```

---

## Troubleshooting Common Issues

### Build Fails with "npm install" Error
- Check that all dependencies in package.json are valid
- Ensure package-lock.json is committed to git
- Try deleting node_modules and package-lock.json, then run `npm install` locally

### Certificate Mismatch Error
- Verify Bundle ID matches: `com.smokelog.app`
- Ensure provisioning profile includes your distribution certificate
- Check that provisioning profile hasn't expired

### App Won't Install on iPhone
- For Ad Hoc: Verify iPhone's UDID is in provisioning profile
- Check that device is running supported iOS version
- Trust the certificate in Settings > General > Device Management

### Build Takes Too Long
- Free tier has 1 concurrent build - if stuck, check for other running builds
- Typical build time: 5-15 minutes
- Check build logs for hanging processes

---

## Cost Summary

**FREE TIER (Recommended for you):**
- Cost: $0/month
- Builds: Unlimited (1 concurrent)
- Live Updates: 500/month
- Perfect for: Development and testing

**When to upgrade:**
- Need faster builds (multiple concurrent)
- Heavy automation requirements
- Advanced analytics and monitoring

---

## Next Steps After Installation

1. Test your app thoroughly on iPhone
2. Collect crash reports and feedback
3. Iterate on features
4. When ready for public release:
   - Create App Store build type in Appflow
   - Upload to TestFlight for beta testing
   - Submit to App Store for review

---

## Additional Resources

- Ionic Appflow Docs: https://ionic.io/docs/appflow
- Capacitor iOS Guide: https://capacitorjs.com/docs/ios
- Apple Developer Portal: https://developer.apple.com/account
- Ionic Community Forum: https://forum.ionicframework.com/
- Certificate Help: https://ionic.io/docs/appflow/package/credentials

---

## Support

If you encounter issues:
1. Check Appflow build logs for specific errors
2. Search Ionic community forums
3. Check this repository's issues
4. Ionic free tier includes community support

---

**Created**: 2025-10-26
**App Version**: 1.0.0
**Capacitor Version**: 7.4.3
**Platform**: iOS on Windows (Cloud Build)
