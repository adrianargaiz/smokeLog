# What to Do Next - iOS Deployment

Your Apple Developer account is approved! Here's exactly what to do now.

---

## Quick Start (30 Minutes)

### Step 1: Get Your Apple Developer Information (5 minutes)

1. Open browser, go to: **https://developer.apple.com/account**
2. Sign in with your Apple ID
3. Look for "Membership" section
4. Copy your **Team ID** (format: ABC123DEF4)
   - Write it here: `_________________`

### Step 2: Create App Store Connect Record (10 minutes)

1. Open new tab, go to: **https://appstoreconnect.apple.com**
2. Sign in with same Apple ID
3. Click **"My Apps"** → **"+"** button → **"New App"**
4. Fill out form:
   - Platform: **iOS**
   - Name: **SmokeLog** (or your choice)
   - Primary Language: **English**
   - Bundle ID: Select **"com.smokelog.app"**
   - SKU: **smokelog-001**
   - User Access: **Full Access**
5. Click **"Create"**
6. After creation, click on the app name
7. Go to **"App Information"** section
8. Copy the **Apple ID** (numeric, like 1234567890)
   - Write it here: `_________________`

**Note:** If "com.smokelog.app" is not in the Bundle ID dropdown, you need to register it first:
- Go to https://developer.apple.com/account/resources/identifiers/list
- Click "+" → "App IDs" → "App" → Continue
- Description: SmokeLog
- Bundle ID: Explicit → **com.smokelog.app**
- Register → Return to Step 2

### Step 3: Update eas.json (2 minutes)

1. Open file: `C:\Proyectos\smokelog\eas.json`
2. Find the "submit" section (around line 46)
3. Replace placeholders with your actual values:
   - `your-apple-id@example.com` → Your Apple ID email
   - `your-app-store-connect-id` → The numeric Apple ID from Step 2
   - `your-team-id` → The Team ID from Step 1

**Example:**
```json
"submit": {
  "production": {
    "ios": {
      "appleId": "john.smith@gmail.com",
      "ascAppId": "1234567890",
      "appleTeamId": "ABC123DEF4"
    }
  }
}
```

4. Save the file
5. Commit changes:
   ```bash
   cd C:\Proyectos\smokelog
   git add eas.json
   git commit -m "Configure Apple Developer credentials"
   git push
   ```

### Step 4: Authenticate EAS with Apple (5 minutes)

Open terminal and run:

```bash
cd C:\Proyectos\smokelog
eas device:create
```

**What happens:**
- Browser opens to Expo login/auth page
- You'll be asked to sign in with your Apple ID
- Grant EAS permission to manage certificates
- This is one-time setup

**Expected output:**
```
> Opening in existing browser session.
> Successfully authenticated with Apple!
```

### Step 5: Create Your First Production Build (3 minutes + 20 minute wait)

Run this command:

```bash
npm run ios:build:prod
```

**What happens:**
1. Builds your React app (1 min)
2. Syncs to iOS (30 sec)
3. Uploads to EAS cloud for building (1 min)
4. EAS builds in cloud (20 min)

**You'll see:**
```
✔ Build started, it may take a few minutes to complete.

Build details:
https://expo.dev/accounts/adrianargaiz/projects/smokelog/builds/...
```

**What to do while waiting:**
- Grab coffee
- Prepare screenshots (see Step 6)
- Review App Store guidelines
- Check status with: `eas build:list --platform ios`

### Step 6: Prepare App Store Assets (During build time)

While your build is running, prepare these:

**Screenshots needed:**
- Take 3-10 screenshots of your app running
- Use iPhone simulator or real device
- Recommended screens to capture:
  1. Main dashboard
  2. Statistics/charts view
  3. Settings or key feature
- Resize to required sizes (or upload and App Store Connect will resize)

**App description:**
Write a 2-3 paragraph description emphasizing:
- What problem it solves (quit smoking)
- Key features
- Benefits to users

**Keywords:**
Think of search terms: quit smoking, stop smoking, health tracker, etc.

**Support URL:**
Where users can get help (GitHub, website, or email)

### Step 7: Submit to App Store (After build completes - 10 minutes)

When build is finished (you'll see "Build finished" message):

```bash
eas submit --platform ios --latest
```

**Expected:**
```
✔ Uploaded successfully!
Build is processing in App Store Connect...
```

**Then:**
1. Go to https://appstoreconnect.apple.com
2. My Apps → SmokeLog → TestFlight → iOS Builds
3. Wait for "Processing" to change to "Ready to Submit" (10-30 min)
4. Click on build, answer export compliance:
   - "Does your app use encryption?" → **No**
5. Submit

---

## Complete App Store Listing (1 hour)

### Fill Out App Information

In App Store Connect → My Apps → SmokeLog → App Store:

1. **App Information:**
   - Name: SmokeLog
   - Subtitle: Your tagline (optional)
   - Privacy Policy: URL if you collect data
   - Category: Health & Fitness

2. **Prepare for Submission:**
   - Click "1.0 Prepare for Submission"
   - Upload screenshots (from Step 6)
   - Add description
   - Add keywords
   - Support URL
   - Marketing URL (optional)

3. **Build:**
   - Click "+" next to Build
   - Select your uploaded build
   - Done

4. **Version Information:**
   - Copyright: 2025 Your Name
   - Version: 1.0.0

5. **App Review Information:**
   - Your contact email
   - Your phone number
   - Demo account if needed
   - Notes for reviewer

6. **Age Rating:**
   - Complete questionnaire
   - Expected: 4+

7. **Pricing:**
   - Free (or set price)

8. **Submit for Review:**
   - Click "Add for Review"
   - Select "Manually release"
   - Click "Submit for Review"

**Done!** Now wait 3-5 days for Apple review.

---

## After Approval (5-7 days from now)

You'll receive email: "Your app status is Ready for Sale"

**To release:**
1. Go to App Store Connect
2. My Apps → SmokeLog
3. Click "Release this Version"
4. App goes live in 1-2 hours

**Verify:**
- Search App Store for "SmokeLog"
- Download and test
- Share with the world!

---

## Quick Reference Commands

```bash
# Navigate to project
cd C:\Proyectos\smokelog

# Check authentication
eas whoami

# Build production
npm run ios:build:prod

# Check build status
eas build:list --platform ios

# Submit to store
eas submit --platform ios --latest

# View build details
eas build:view [BUILD_ID]
```

---

## Helpful Resources

- **Full deployment guide:** `DEPLOYMENT-GUIDE.md` (in this folder)
- **Checklist:** `DEPLOYMENT-CHECKLIST.md` (in this folder)
- **EAS Build docs:** https://docs.expo.dev/build/introduction/
- **App Store Connect:** https://appstoreconnect.apple.com
- **Apple Developer:** https://developer.apple.com/account

---

## Timeline Summary

- **Today (30 min active):** Setup, build, submit
- **Today (20 min wait):** Build processing
- **Today (1 hour):** App Store listing
- **Days 1-2:** Apple processes build
- **Days 3-7:** App review
- **Day 7:** Approval and release

---

## Current Status

- Apple Developer: ✓ Approved
- EAS Account: ✓ Configured (adrianargaiz)
- Project Setup: ✓ Complete
- Build Config: ✓ Ready

**Next:** Do Step 1 above (get Team ID)

---

## Need Help?

Run into issues? Common problems:

**Can't find Team ID:**
- developer.apple.com/account → Membership section

**Can't find App Store Connect ID:**
- appstoreconnect.apple.com → My Apps → Click app → App Information → Apple ID

**Build failed:**
```bash
# View detailed logs
eas build:list
# Click on build URL in terminal
```

**Not authenticated:**
```bash
eas login
# Or for Apple:
eas device:create
```

---

Start with Step 1 and work through sequentially. Each step builds on the previous one.

Good luck with your launch!
