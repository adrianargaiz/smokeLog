# iOS App Store Deployment Guide - SmokeLog

Congratulations on getting your Apple Developer account approved! This guide will walk you through deploying your app to the App Store.

---

## Current Project Status

- **App Name**: SmokeLog
- **Bundle ID**: com.smokelog.app
- **Version**: 1.0.0
- **Build Number**: 1
- **Tech Stack**: React + Capacitor 7.4.3
- **Build System**: EAS Build (Expo Application Services)
- **EAS Account**: adrianargaiz
- **EAS Project**: @adrianargaiz/smokelog
- **Project ID**: 59be5394-a097-4b44-acff-38e58acdedbe
- **Status**: Production-ready, 0 errors

---

## Overview: EAS Build Approach

Your project is configured to use **EAS Build**, which means:
- Builds happen in the cloud (no Mac required from Windows!)
- EAS manages certificates and provisioning profiles automatically
- You can build, test, and submit from your Windows machine
- All commands run from your terminal

---

## Phase 1: Initial Apple Developer Setup (Do This First!)

### Step 1.1: Verify Apple Developer Account

1. Visit https://developer.apple.com/account
2. Sign in with the Apple ID you used for enrollment
3. Confirm you see "Active" membership status
4. Note your **Team ID** (looks like: ABC123DEF4)

### Step 1.2: Create App Store Connect Record

1. Go to https://appstoreconnect.apple.com
2. Sign in with the same Apple ID
3. Click **"My Apps"**
4. Click the **"+"** button → **"New App"**
5. Fill out the form:
   - **Platform**: iOS
   - **Name**: SmokeLog (or your preferred app name)
   - **Primary Language**: English (or your language)
   - **Bundle ID**: Select **"com.smokelog.app"** from dropdown
     - If not available, you need to register it first (see Step 1.3)
   - **SKU**: smokelog-001 (unique identifier for your records)
   - **User Access**: Full Access

6. Click **"Create"**
7. Note the **App Store Connect App ID** (numeric, like: 1234567890)

### Step 1.3: Register Bundle ID (If Not Already Done)

If com.smokelog.app wasn't available in Step 1.2:

1. Go to https://developer.apple.com/account/resources/identifiers/list
2. Click **"+"** to add new identifier
3. Select **"App IDs"** → Continue
4. Select **"App"** → Continue
5. Fill in:
   - **Description**: SmokeLog
   - **Bundle ID**: Explicit → **com.smokelog.app**
   - **Capabilities**: Check any needed (Push Notifications, etc.)
6. Click **"Continue"** → **"Register"**
7. Return to Step 1.2 to create App Store Connect record

---

## Phase 2: Configure EAS for Apple Developer Account

### Step 2.1: Link Your Apple Developer Account to EAS

Run this command to authenticate:

```bash
cd C:\Proyectos\smokelog
eas device:create
```

**What happens:**
- You'll be prompted to sign in with your Apple ID
- EAS will request access to manage certificates and profiles
- You'll authorize EAS to access your Apple Developer account
- This is a one-time setup

**Expected output:**
```
> Sign in to your Apple Developer account
> Open https://expo.dev/... in your browser
> [After signing in] Successfully authenticated!
```

### Step 2.2: Update eas.json with Your Apple Developer Details

Edit the file to add your credentials:

**File**: `C:\Proyectos\smokelog\eas.json`

Update the `submit.production.ios` section:

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-actual-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123DEF4"
      }
    }
  }
}
```

**Where to find these values:**
- **appleId**: The email you use for developer.apple.com
- **ascAppId**: From App Store Connect → My Apps → Your App → App Information → Apple ID (numeric)
- **appleTeamId**: From developer.apple.com/account → Membership → Team ID

---

## Phase 3: Create Your First Production Build

### Step 3.1: Ensure Code is Ready

```bash
cd C:\Proyectos\smokelog

# Verify no uncommitted changes
git status

# If there are changes, commit them
git add .
git commit -m "Prepare for production build"
git push
```

### Step 3.2: Build Production IPA

Run the production build:

```bash
npm run ios:build:prod
```

This command does:
1. Builds your React app (`npm run build`)
2. Syncs to Capacitor iOS (`npx cap sync ios`)
3. Runs EAS Build with production profile

**What to expect:**
- Build process starts in EAS cloud
- Takes 15-25 minutes
- You'll see progress in terminal
- Can close terminal and check status later with: `eas build:list`

**Expected output:**
```
✔ Build finished.

https://expo.dev/accounts/adrianargaiz/projects/smokelog/builds/XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX

Build details:
Platform: iOS
Status: Finished
Build profile: production
Artifact: https://expo.dev/.../smokelog-1.0.0-1.ipa
```

### Step 3.3: Verify Build Success

Once complete, you should have:
- A downloadable `.ipa` file (iOS app package)
- Build marked as "Finished" with green checkmark
- No errors in build logs

**To check build status later:**
```bash
eas build:list --platform ios
```

---

## Phase 4: Submit to App Store Connect

### Step 4.1: Submit the Build

After your production build succeeds, submit it:

```bash
eas submit --platform ios --latest
```

**Flags explained:**
- `--platform ios`: Target iOS App Store
- `--latest`: Use the most recent successful build

**What happens:**
- EAS uploads your IPA to App Store Connect
- Takes 5-10 minutes
- Build appears in App Store Connect → TestFlight → iOS Builds

**Expected output:**
```
✔ Uploaded successfully!

Build processed and available in App Store Connect:
https://appstoreconnect.apple.com/...
```

### Step 4.2: Wait for Build Processing

In App Store Connect:
1. Go to **My Apps** → **SmokeLog**
2. Click **TestFlight** tab
3. Look under **iOS Builds**
4. Status will change from "Processing" → "Ready to Submit"
5. Takes 10-30 minutes

**Status indicators:**
- **Processing**: Apple is validating your build
- **Missing Compliance**: Need to answer export compliance questions
- **Ready to Submit**: Build is ready for TestFlight or App Store

---

## Phase 5: TestFlight Beta Testing (Recommended)

### Step 5.1: Enable TestFlight

After build shows "Ready to Submit":

1. In App Store Connect → **TestFlight** → **iOS Builds**
2. Click on your build version (1.0.0)
3. Answer **Export Compliance** questions:
   - "Does your app use encryption?"
     - Select **No** (unless you added custom encryption beyond HTTPS)
   - Click **Submit**

### Step 5.2: Add Internal Testers

1. Click **Internal Testing** (left sidebar)
2. Click **"+"** next to Internal Testers
3. Add email addresses (up to 100 testers)
4. They'll receive TestFlight invite via email
5. They download TestFlight app and install your beta

**Internal testers:**
- Can test immediately (no Apple review needed)
- Great for final QA before public release
- You can invite yourself to test on your iPhone

### Step 5.3: Add External Testers (Optional)

For wider beta testing:

1. Click **External Testing** → **"+"** to create new group
2. Add testers (up to 10,000)
3. Submit for **Beta App Review** (required for external testing)
4. Review takes 1-2 days
5. Once approved, testers can install

---

## Phase 6: App Store Submission

### Step 6.1: Complete App Store Information

In App Store Connect → **My Apps** → **SmokeLog** → **App Store** tab:

**1. App Information:**
- Name: SmokeLog
- Subtitle: Track your smoke-free journey
- Privacy Policy URL: (required if you collect data)
- Category: Health & Fitness
- Secondary Category: (optional)

**2. Pricing and Availability:**
- Price: Free (or set your price)
- Availability: All countries (or select specific)

**3. Prepare for Submission Section:**

Click **1.0 Prepare for Submission**:

**Screenshots (Required):**
- iPhone 6.7" Display (1290 x 2796 pixels) - up to 10 screenshots
- iPhone 6.5" Display (1242 x 2688 pixels) - up to 10 screenshots
- Can use the same screenshots for both sizes

**App Preview Video (Optional):**
- 30-second preview video
- Same sizes as screenshots

**Description:**
```
SmokeLog helps you track your journey to quit smoking. Monitor your progress, see health improvements, and stay motivated with detailed statistics and insights.

Features:
- Track smoke-free days
- Monitor health improvements
- View savings from not smoking
- Detailed progress charts
- Motivational milestones
- Offline support
```

**Keywords:**
```
quit smoking, stop smoking, smoking cessation, health tracker, smoke free, nicotine, wellness, healthy habits
```

**Support URL**: Your website or support page
**Marketing URL** (optional): Your marketing site

**4. Build Selection:**
- Click **"+"** next to Build
- Select your uploaded build (1.0.0)
- Click **Done**

**5. Version Information:**
- Version: 1.0.0
- Copyright: 2025 [Your Name/Company]

**6. App Review Information:**
- Contact email: your-email@example.com
- Contact phone: Your phone number
- Demo account (if login required): username/password
- Notes for reviewer: Any special instructions

**7. Age Rating:**
- Click **Edit** next to Age Rating
- Answer questionnaire honestly
- SmokeLog likely qualifies for 4+

### Step 6.2: Submit for Review

1. Click **Add for Review** (top right)
2. Review all information for completeness
3. Select **Manually release this version** (recommended for first release)
   - Or: **Automatically release after approval**
4. Click **Submit for Review**

**Expected timeline:**
- Submission received: Immediate
- In Review: 24-48 hours wait
- Review duration: 1-3 days
- Total: 3-5 days average

---

## Phase 7: Post-Submission

### During Review

**Status tracking:**
- App Store Connect → My Apps → SmokeLog
- Status: "Waiting for Review" → "In Review" → "Pending Developer Release"

**Possible outcomes:**

**1. Approved:**
- Status: "Pending Developer Release" (if manual release selected)
- Click **Release this Version** to publish
- App goes live in 1-2 hours

**2. Rejected:**
- You'll receive email with rejection reason
- Address the issues in App Store Connect
- Resubmit (no new build needed unless code changes required)

### After Approval

**If you selected manual release:**
1. Status shows "Pending Developer Release"
2. Click **Release this Version** when ready
3. App goes live in App Store within 1-2 hours

**If you selected automatic release:**
- App publishes automatically upon approval

### Monitoring

Track your app:
- App Store Connect → Analytics
- TestFlight → Metrics
- App Store → Ratings & Reviews

---

## Complete Command Reference

### Essential Commands

```bash
# Navigate to project
cd C:\Proyectos\smokelog

# Check EAS authentication
eas whoami

# Check project status
eas project:info

# Build for production
npm run ios:build:prod

# Check build status
eas build:list --platform ios

# Submit to App Store
eas submit --platform ios --latest

# Check previous submissions
eas submit:list --platform ios
```

### Development Commands

```bash
# Build for iOS simulator (testing)
eas build --platform ios --profile simulator

# Build for development (ad-hoc distribution)
eas build --platform ios --profile development

# Build for preview (internal distribution)
eas build --platform ios --profile preview

# Register a test device
eas device:create

# List registered devices
eas device:list
```

### Maintenance Commands

```bash
# View build logs
eas build:view [BUILD_ID]

# Cancel a running build
eas build:cancel

# List all builds
eas build:list

# Re-run last build
eas build --platform ios --profile production
```

---

## Troubleshooting

### Build Errors

**Error: "Git working directory not clean"**
```bash
git add .
git commit -m "Prepare for build"
git push
```

**Error: "Provisioning profile doesn't include signing certificate"**
```bash
# Clear credentials and re-authenticate
eas credentials
# Select "iOS" → "Remove all credentials" → Re-run build
```

**Error: "Unable to find team"**
```bash
# Re-authenticate with Apple
eas device:create
# This re-triggers Apple authentication flow
```

### Submission Errors

**Error: "Missing compliance information"**
- In App Store Connect → TestFlight → Build
- Answer export compliance questions
- Resubmit

**Error: "Invalid IPA"**
- Rebuild with production profile
- Ensure bundle ID matches exactly: com.smokelog.app

**Error: "App icon missing"**
- Check ios/App/App/Assets.xcassets/AppIcon.appiconset/
- Ensure all icon sizes present

### App Store Rejection Common Issues

**Issue: Privacy Policy Missing**
- Add privacy policy URL in App Store Connect
- Must be accessible web page

**Issue: App Metadata Rejected**
- Review App Store Review Guidelines
- Update screenshots/description to comply
- Resubmit metadata only

**Issue: Functionality Issues**
- Apple testers found bugs
- Fix code, create new build
- Submit new build for review

---

## Version Updates (Future Releases)

### For version 1.0.1, 1.1.0, etc.

1. **Update version in app.json:**
   ```json
   {
     "expo": {
       "version": "1.0.1",
       "ios": {
         "buildNumber": "2"
       }
     }
   }
   ```

2. **Commit changes:**
   ```bash
   git add .
   git commit -m "Bump version to 1.0.1"
   git push
   ```

3. **Build new version:**
   ```bash
   npm run ios:build:prod
   ```

4. **Submit update:**
   ```bash
   eas submit --platform ios --latest
   ```

5. **In App Store Connect:**
   - Click **"+"** next to iOS App
   - Enter new version number
   - Add "What's New" release notes
   - Select new build
   - Submit for review

**Note:** Updates typically review faster (1-2 days vs 3-5 days for initial)

---

## Immediate Next Steps

Now that your Apple Developer account is approved, do these in order:

### Step 1: Gather Apple Developer Information
1. Visit https://developer.apple.com/account
2. Note your **Team ID**

### Step 2: Create App Store Connect Record
1. Visit https://appstoreconnect.apple.com
2. Create new app for SmokeLog
3. Note the **App Store Connect App ID** (numeric)

### Step 3: Update eas.json
Edit the file with your actual credentials:
```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-email@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "ABC123DEF4"
      }
    }
  }
}
```

### Step 4: Authenticate EAS with Apple
```bash
cd C:\Proyectos\smokelog
eas device:create
```
This will prompt you to sign in with your Apple ID and authorize EAS.

### Step 5: Create Production Build
```bash
npm run ios:build:prod
```

### Step 6: Submit to App Store
```bash
eas submit --platform ios --latest
```

### Step 7: Complete App Store Listing
Follow Phase 6 of this guide to add screenshots, description, etc.

### Step 8: Submit for Review
Click "Submit for Review" in App Store Connect

---

## Getting Help

**EAS Build Documentation:**
https://docs.expo.dev/build/introduction/

**App Store Connect Help:**
https://developer.apple.com/support/app-store-connect/

**Capacitor iOS Documentation:**
https://capacitorjs.com/docs/ios

**App Store Review Guidelines:**
https://developer.apple.com/app-store/review/guidelines/

**Build Issues:**
```bash
# Check build logs
eas build:list
# Click on build URL to view detailed logs
```

---

## Summary

You're ready to deploy! Your project is fully configured with:
- EAS Build for cloud builds from Windows
- Production-ready code with 0 errors
- Proper bundle ID and configuration
- All necessary npm scripts set up

Expected total timeline from now:
- **Day 1**: Configure Apple credentials, create production build (30 min + 20 min build time)
- **Day 1**: Submit to App Store Connect (10 min upload)
- **Day 1-2**: Optional TestFlight beta testing
- **Day 3-7**: App Store review
- **Day 7**: App goes live!

Start with Step 1 above and work through sequentially. Come back if you hit any issues!
