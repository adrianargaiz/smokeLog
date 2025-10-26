# Ionic Appflow Quick Start - Get Your App on iPhone in 30 Minutes

This is the fastest path to get SmokeLOG running on your iPhone from Windows.

## Prerequisites Checklist

- [ ] Apple Developer account (APPROVED - you have this!)
- [ ] GitHub repository (DONE - https://github.com/adrianargaiz/smokeLog)
- [ ] Physical iPhone with UDID
- [ ] Latest code pushed to GitHub
- [ ] 30 minutes of time

---

## Fast Track Setup (30 Minutes)

### STEP 1: Create Appflow Account (5 minutes)

1. Go to: https://ionic.io/appflow
2. Click "Start for Free"
3. Sign up with GitHub (easiest - uses your adrianargaiz account)
4. Choose FREE Starter Plan (no credit card needed!)

### STEP 2: Connect Repository (3 minutes)

1. In Appflow dashboard: https://dashboard.ionicframework.com
2. Click "New App"
3. Select "GitHub" > Find "adrianargaiz/smokeLog"
4. Name it: "SmokeLOG"
5. Click "Create App"

### STEP 3: Get Your iPhone UDID (2 minutes)

**Option A - Using Online Tool (Easiest on Windows):**
1. Go to: https://www.whatismyudid.com/
2. Follow instructions to get UDID
3. Copy the UDID (40-character hex string)

**Option B - If you have iTunes:**
1. Connect iPhone to computer
2. Open iTunes
3. Click iPhone icon > Summary
4. Click on Serial Number until it shows UDID
5. Right-click UDID > Copy

### STEP 4: Create Apple Certificates (15 minutes)

This is the most complex part, but we'll break it down:

#### A. Generate Certificate Signing Request (3 minutes)

1. Open Git Bash or PowerShell in Windows
2. Run these commands (replace YOUR_EMAIL):

```bash
cd C:\Proyectos\smokelog
openssl req -new -newkey rsa:2048 -nodes -out SmokeLOG.csr -keyout SmokeLOG.key -subj "/emailAddress=YOUR_EMAIL@example.com/CN=SmokeLOG Distribution/C=US"
```

This creates two files:
- `SmokeLOG.csr` - Upload to Apple
- `SmokeLOG.key` - Keep safe! You need this later

#### B. Create Distribution Certificate at Apple (5 minutes)

1. Go to: https://developer.apple.com/account/resources/certificates
2. Click "+" button
3. Select "Apple Distribution"
4. Click "Continue"
5. Upload the `SmokeLOG.csr` file you just created
6. Click "Continue" and then "Download"
7. Save as `distribution.cer`

#### C. Convert Certificate to .p12 (2 minutes)

Back in Git Bash/PowerShell:

```bash
# Convert .cer to .pem
openssl x509 -inform DER -outform PEM -in distribution.cer -out distribution.pem

# Create .p12 with password (YOU MUST REMEMBER THIS PASSWORD!)
openssl pkcs12 -export -out distribution.p12 -inkey SmokeLOG.key -in distribution.pem
```

When prompted, enter a password (e.g., "SmokeLOG2025") - WRITE IT DOWN!

#### D. Create Provisioning Profile (5 minutes)

1. Go to: https://developer.apple.com/account/resources/profiles
2. Click "+"
3. Select "Ad Hoc" > Continue
4. Choose App ID: Find "com.smokelog.app" (or create if not exists)
5. Select the distribution certificate you just created
6. **IMPORTANT**: Select your iPhone device (add it using UDID from Step 3)
7. Name it: "SmokeLOG AdHoc"
8. Click "Generate" and "Download"
9. Save as `SmokeLOG_AdHoc.mobileprovision`

### STEP 5: Upload to Appflow (3 minutes)

1. In Appflow dashboard > Your app > "Certificates" (left sidebar)
2. Click "Add Certificate"
3. Fill in:
   - **Name**: iOS Distribution
   - **Type**: Production (for both Ad Hoc and App Store)
   - **Certificate**: Upload `distribution.p12`
   - **Password**: Enter the password you set
   - **Provisioning Profile**: Upload `SmokeLOG_AdHoc.mobileprovision`
4. Click "Save"

### STEP 6: Build Your App (2 minutes)

1. Make sure latest code is pushed to GitHub:
```bash
cd C:\Proyectos\smokelog
git add .
git commit -m "Ready for Appflow build"
git push origin main
```

2. In Appflow dashboard > "Builds"
3. Click "New Build"
4. Configure:
   - Platform: iOS
   - Type: Ad Hoc
   - Certificate: iOS Distribution
   - Commit: Latest
5. Click "Submit Build"

### STEP 7: Wait for Build (5-10 minutes)

- Watch the build progress
- Green checkmark = Success!
- If fails, check logs and see troubleshooting below

### STEP 8: Install on iPhone (5 minutes)

**Easiest Method - Using Diawi:**

1. Download the .ipa from Appflow (click "Download" on successful build)
2. Go to: https://www.diawi.com/
3. Upload your .ipa file
4. Copy the generated link
5. Open link on your iPhone Safari
6. Tap "Install"
7. Go to Settings > General > Device Management
8. Tap on your developer certificate
9. Tap "Trust"
10. Open SmokeLOG from home screen!

---

## Troubleshooting Quick Fixes

### "Unable to install" on iPhone
- Check: Is your iPhone's UDID in the provisioning profile?
- Fix: Go back to Apple Developer > Profiles > Edit profile > Add device

### Build fails at "npm install"
- Check: Is package-lock.json committed to git?
- Fix: Run `npm install` locally, commit package-lock.json, push

### Certificate error in Appflow
- Check: Does Bundle ID match exactly `com.smokelog.app`?
- Check: Did you use the same certificate in the provisioning profile?
- Fix: Recreate provisioning profile with correct certificate

### App crashes on launch
- Check build logs in Appflow
- Check iOS version on your phone (should be 12.0+)
- Rebuild with debug configuration

---

## After First Successful Install

### For Easier Future Testing

**Set up TestFlight (one-time, 20 min):**

1. Create App Store build instead of Ad Hoc in Appflow
2. Download .ipa
3. Upload to App Store Connect using Transporter app
4. Add yourself as internal tester in TestFlight
5. Install TestFlight app on iPhone
6. Future builds go directly to TestFlight - much easier!

**Set up Auto-builds:**

1. In Appflow > Automations > New Automation
2. Trigger: Push to main
3. Action: Build iOS Ad Hoc
4. Now every git push builds automatically!

---

## Cost Reminder

- FREE plan: Unlimited builds (1 at a time)
- No credit card needed
- Perfect for testing and development
- Upgrade only if you need concurrent builds ($89/month)

---

## Commands Reference

```bash
# Check if code is ready to push
git status

# Push to trigger build
git add .
git commit -m "Your message"
git push origin main

# Link local project to Appflow (optional)
ionic link

# Trigger build from CLI (after linking)
ionic build ios

# Check build status
ionic build list
```

---

## What You Get

After following this guide:
- SmokeLOG installed on your iPhone
- Ability to rebuild anytime from Windows
- No need for Mac or Xcode
- Ready to iterate and test
- Path to App Store submission

---

## Next Steps

1. Test all features on your iPhone
2. Collect feedback
3. Make improvements
4. Push to GitHub > Auto-build > Test
5. Repeat until ready for App Store
6. Switch to App Store build type
7. Upload to TestFlight for beta testing
8. Submit to App Store

---

**Time to first install: ~30 minutes**
**Subsequent builds: ~2 minutes to trigger + 10 minutes build time**

Need the detailed guide? See: IONIC_APPFLOW_SETUP.md
