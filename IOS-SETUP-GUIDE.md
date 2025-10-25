# iOS Setup Guide - SmokeLog App

## Current Status

- Project: SmokeLog (com.smokelog.app)
- EAS Account: adrianargaiz
- Git Repository: Initialized (commit: dfea1fd)
- Configuration Files: Ready
- Simulator Build Profile: Configured

---

## PART 1: Apple Developer Program Enrollment

### Step 1: Pre-Enrollment Checklist

Before enrolling, ensure you have:

- Active Apple ID (create at https://appleid.apple.com if needed)
- Two-factor authentication ENABLED on your Apple ID (REQUIRED)
- Valid credit/debit card for $99/year payment
- Your legal name (must match payment method)
- Phone number capable of receiving SMS
- Physical mailing address (no PO boxes)

### Step 2: Enroll in Apple Developer Program

1. Visit: **https://developer.apple.com/programs/enroll/**

2. Click **"Start Your Enrollment"**

3. Sign in with your Apple ID

4. Complete two-factor authentication

5. **Choose Entity Type:**
   - **Individual** (Recommended): Faster approval (24 hours), simpler process
   - **Organization**: Requires D-U-N-S number, 48-72 hours approval

6. **Accept Agreements:**
   - Read the Apple Developer Agreement
   - Check "I have read and agree..."
   - Click Continue

7. **Complete Profile Information:**
   - Legal Name: (exactly as on payment method)
   - Phone Number: (must receive SMS)
   - Address: (physical address required)
   - Contact Email: (for Apple notifications)

8. **Payment:**
   - Review: Apple Developer Program - $99.00/year
   - Enter payment information
   - Verify billing details match cardholder name
   - Click "Purchase"

9. **Confirmation:**
   - You'll see "Thank you for your purchase"
   - Check email for receipt from Apple

### Step 3: Verification Wait (24-48 hours)

**Timeline:**
- Individual: Usually 24 hours
- Organization: Usually 48 hours, can take up to 7 days

**What to Watch For:**

**Immediate:**
- Email: "Thank you for your order" (receipt)
- Status at https://developer.apple.com/account: "Enrollment Pending"

**During Verification:**
- Apple performs automated identity and payment verification
- No action required from you
- Possible email: "Additional information needed" (respond quickly)

**Approval:**
- Email: "Welcome to the Apple Developer Program"
- Status changes to "Active" with expiration date
- Full access to developer portal enabled

**How to Check Status:**
1. Visit: https://developer.apple.com/account
2. Sign in with your Apple ID
3. Look for membership status:
   - Pending: "Enrollment in progress"
   - Approved: "Active" with expiration date

**If Delayed Beyond 48 Hours:**
- Check spam/junk email folders
- Contact Apple Developer Support: https://developer.apple.com/contact/
- Phone: 1-800-633-2152 (US)

### Step 4: Post-Approval Actions

**When You Receive Approval Email:**

1. Verify access at: https://developer.apple.com/account
2. Confirm "Active" membership status
3. Note your expiration date (1 year from enrollment)

**DO NOT:**
- Create certificates manually
- Create provisioning profiles
- Make any configuration changes in Apple Developer Portal

**DO:**
- Return to this document and proceed to Part 2
- Continue with simulator testing while waiting
- Notify the development team that you're approved

---

## PART 2: Immediate Testing - iOS Simulator Builds

While waiting for Apple Developer approval, you can test immediately with simulator builds!

### What You Can Do NOW (No Apple Developer Account Required)

1. Build for iOS Simulator
2. Test on Mac with Xcode Simulator
3. Verify app functionality
4. Continue development
5. Fix bugs before App Store submission

### Step 1: Initialize EAS Project

Run these commands in your terminal:

```bash
# Navigate to project
cd C:\Proyectos\smokelog

# Initialize EAS project (will prompt for confirmation)
eas init

# When prompted: "Would you like to create a project for @adrianargaiz/smokelog?"
# Answer: y (yes)
```

**Expected Output:**
```
✔ Created @adrianargaiz/smokelog
✔ Linked local project to EAS project ...
```

### Step 2: Verify EAS Configuration

```bash
# Check project info
eas project:info

# Expected output:
# Project: smokelog
# Owner: adrianargaiz
# Slug: smokelog
```

### Step 3: Build for iOS Simulator

```bash
# Sync your latest web build with iOS
npm run build
npx cap sync ios

# Trigger simulator build
eas build --platform ios --profile simulator
```

**What Happens:**
1. EAS uploads your project to build servers
2. Builds iOS app for simulator (no code signing needed!)
3. Takes 10-15 minutes
4. Provides download link when complete

**Expected Output:**
```
✔ Build successful
Download: https://expo.dev/accounts/adrianargaiz/projects/smokelog/builds/...
```

### Step 4: Download and Test

**On macOS:**
1. Download the .tar.gz file from the link
2. Extract: `tar -xvf [filename].tar.gz`
3. Open Xcode Simulator
4. Drag and drop the .app file onto simulator
5. Test your app!

**On Windows (you'll need a Mac or cloud Mac):**
- Use a Mac computer for testing
- Use a cloud Mac service (MacStadium, MacinCloud)
- Ask a teammate with a Mac to test
- Wait for device builds after Apple Developer approval

---

## PART 3: While You Wait (Productive Activities)

### Continue Development

**Test on Android:**
```bash
npm run android:run
```

**Test in Browser:**
```bash
npm run dev
# Open http://localhost:5173
```

**Test Mobile View in Browser:**
1. Open browser DevTools (F12)
2. Click mobile device icon
3. Select iPhone/iPad from device list
4. Test responsive behavior

### Prepare iOS Assets

Your app already has some assets, but you can optimize them:

**App Icon Requirements:**
- 1024x1024 PNG (no transparency)
- Current: Located at `ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png`

**Splash Screen:**
- Current: Located at `ios/App/App/Assets.xcassets/Splash.imageset/`
- Already configured with multiple sizes

**Additional Assets to Prepare:**
- App Store screenshots (6.5" and 5.5" required)
- App preview videos (optional)
- App description and keywords
- Privacy policy URL

### Review iOS Guidelines

**Read These Important Documents:**

1. **Human Interface Guidelines:**
   https://developer.apple.com/design/human-interface-guidelines/ios

   Key topics:
   - Navigation patterns
   - Gestures
   - Typography
   - Color usage
   - Accessibility

2. **App Store Review Guidelines:**
   https://developer.apple.com/app-store/review/guidelines/

   Critical sections:
   - 2.3: Accurate metadata
   - 4.0: Design (minimum functionality)
   - 5.1: Privacy (data collection disclosure)

3. **Privacy Requirements:**
   - If collecting data: Privacy policy required
   - App Tracking Transparency (ATT) framework
   - Privacy nutrition labels

**Common Rejection Reasons to Avoid:**
- Crashes on launch
- Incomplete functionality
- Missing privacy policy
- Poor user interface
- Buttons/features that don't work
- Requesting unnecessary permissions

### Plan TestFlight Beta Testing

**What is TestFlight?**
- Apple's official beta testing platform
- Test with up to 10,000 external testers
- Testers install via TestFlight app
- Automatic distribution of updates
- Feedback collection from testers

**Planning Your Beta:**

1. **Internal Testing First:**
   - Test with your team
   - Fix critical bugs
   - Verify core functionality

2. **External Beta Testers:**
   - Friends and family
   - Target users
   - Feedback community

3. **Beta Timeline:**
   - Week 1: Internal testing (team)
   - Week 2-3: External beta (small group)
   - Week 4: Final fixes and polish
   - Week 5: App Store submission

**Prepare TestFlight Info:**
- App description for testers
- What to test instructions
- Known issues list
- Feedback collection method

### Check Capacitor Plugins

Verify your iOS plugins are configured correctly:

**Current Plugins:**
- @capacitor/app@7.1.0
- @capacitor/haptics@7.0.2
- @capacitor/splash-screen@7.0.3
- @capacitor/status-bar@7.0.3

**Test Each Plugin:**
```typescript
// Test in your app
import { Haptics } from '@capacitor/haptics';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

// Test haptics
await Haptics.vibrate();

// Test status bar
await StatusBar.setStyle({ style: Style.Dark });

// Test splash screen
await SplashScreen.hide();
```

### Update App Metadata

**In capacitor.config.ts:**
Currently configured:
```typescript
{
  appId: 'com.smokelog.app',
  appName: 'SmokeLog',
  // ... other config
}
```

**In package.json:**
```json
{
  "name": "smokelog",
  "displayName": "SmokeLog",
  "description": "Smoking cessation tracking mobile app",
  "version": "1.0.0"
}
```

**Prepare for App Store Connect:**
- App Name: SmokeLog (check availability)
- Subtitle: (50 characters max)
- Keywords: smoking, quit, cessation, health, tracker
- Category: Health & Fitness or Medical
- Age Rating: 17+ (tobacco references)

---

## PART 4: After Apple Developer Approval

**When you receive the "Welcome to the Apple Developer Program" email:**

### Next Steps (Come Back Here!)

1. **Verify Account:**
   - Visit: https://developer.apple.com/account
   - Confirm "Active" status
   - Note your Team ID

2. **Update EAS Configuration:**

   Run this command with your actual Apple ID and Team ID:
   ```bash
   # This will be provided in the next phase
   ```

3. **Create Certificates & Provisioning:**
   - Development certificates
   - Distribution certificates
   - Push notification certificates (if needed)
   - Provisioning profiles

4. **Register Your Device (Optional - for development builds):**

   Get your iPhone's UDID:
   - Connect iPhone to Mac
   - Open Finder (macOS Catalina+) or iTunes
   - Click on device
   - Click on device info to reveal UDID
   - Copy UDID

   Register with EAS:
   ```bash
   eas device:create
   ```

5. **Build Development Build:**
   ```bash
   eas build --platform ios --profile development
   ```

6. **Build Production Build:**
   ```bash
   eas build --platform ios --profile production
   ```

7. **Submit to App Store:**
   ```bash
   eas submit --platform ios
   ```

---

## Quick Reference Commands

**Build Commands:**
```bash
# Web build
npm run build

# Sync to iOS
npx cap sync ios

# iOS Simulator build (no Apple Developer needed)
eas build --platform ios --profile simulator

# iOS Development build (Apple Developer required)
eas build --platform ios --profile development

# iOS Production build (Apple Developer required)
eas build --platform ios --profile production
```

**Development Commands:**
```bash
# Start dev server
npm run dev

# Run Android
npm run android:run

# Open Android Studio
npm run cap:open:android
```

**EAS Commands:**
```bash
# Check EAS login
eas whoami

# Check project info
eas project:info

# List builds
eas build:list

# View build details
eas build:view [build-id]

# Register device
eas device:create

# List devices
eas device:list
```

---

## Build Profiles Reference

Your `eas.json` configuration:

```json
{
  "build": {
    "simulator": {
      "distribution": "internal",
      "ios": {
        "simulator": true,
        "buildConfiguration": "Debug"
      }
    },
    "development": {
      "distribution": "internal",
      "ios": {
        "buildConfiguration": "Debug",
        "simulator": false
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      }
    },
    "production": {
      "distribution": "store",
      "autoIncrement": true,
      "ios": {
        "simulator": false,
        "buildConfiguration": "Release"
      }
    }
  }
}
```

**Profile Purposes:**
- **simulator**: Test on Mac simulator (no signing needed)
- **development**: Install on registered devices (development certificate)
- **preview**: Internal testing (ad-hoc distribution)
- **production**: App Store submission (distribution certificate)

---

## Troubleshooting

### Simulator Build Issues

**"Build failed" error:**
```bash
# Check build logs
eas build:view [build-id]

# Common fixes:
npm run build  # Rebuild web assets
npx cap sync ios  # Resync Capacitor
git add . && git commit -m "Fix build"  # Commit changes
```

**"Git not clean" error:**
```bash
git status  # Check uncommitted changes
git add .
git commit -m "Commit message"
```

### EAS Project Issues

**"Project not configured":**
```bash
eas init  # Initialize EAS project
```

**"Not logged in":**
```bash
eas login  # Login with Expo account
eas whoami  # Verify login
```

### Apple Developer Issues

**Enrollment taking longer than 48 hours:**
- Check spam/junk folders
- Verify payment processed
- Contact Apple Developer Support

**Need to verify identity:**
- Apple may request photo ID
- Respond quickly to verification emails
- Use clear, legible document photos

---

## Support Resources

**EAS Build Documentation:**
https://docs.expo.dev/build/introduction/

**Capacitor iOS Documentation:**
https://capacitorjs.com/docs/ios

**Apple Developer Support:**
- Portal: https://developer.apple.com/contact/
- Phone: 1-800-633-2152 (US)
- Email: Available through developer portal

**Expo Forums:**
https://forums.expo.dev/

**Capacitor Discord:**
https://discord.gg/UPYqBWTEwQ

---

## Timeline Summary

### Immediate (Today):
- Enroll in Apple Developer Program ($99)
- Initialize EAS project: `eas init`
- Build simulator: `eas build --platform ios --profile simulator`
- Continue Android testing
- Prepare iOS assets

### 24-48 Hours (Approval Wait):
- Apple processes enrollment
- Test simulator builds
- Review iOS guidelines
- Optimize app for iOS
- Plan beta testing strategy

### After Approval (Day 3+):
- Configure certificates
- Register test devices
- Build development version
- Internal testing
- Fix bugs

### Week 2-3 (Beta Testing):
- Submit to TestFlight
- External beta testing
- Collect feedback
- Iterate and improve

### Week 4-5 (App Store):
- Final polish
- Prepare App Store listing
- Submit for review
- Address any rejection issues
- Launch!

---

## Next Actions Checklist

### Immediate Actions:
- [ ] Start Apple Developer enrollment
- [ ] Run `eas init` to initialize project
- [ ] Run first simulator build
- [ ] Test on Android while waiting
- [ ] Review iOS Human Interface Guidelines

### During Wait (24-48 hours):
- [ ] Monitor email for Apple approval
- [ ] Test simulator builds
- [ ] Prepare app store screenshots
- [ ] Write app description
- [ ] Create privacy policy (if needed)
- [ ] Plan TestFlight beta

### After Approval:
- [ ] Verify active status at developer.apple.com
- [ ] Note Team ID from developer portal
- [ ] Return here for certificate setup
- [ ] Build development version
- [ ] Register test devices
- [ ] Begin TestFlight beta

---

## Important Notes

1. **Do NOT create certificates manually** - We'll use EAS to handle this automatically
2. **Keep your Apple Developer password secure** - Required for submissions
3. **Enable two-factor authentication** - Required by Apple
4. **Annual renewal** - Mark calendar for renewal in 1 year ($99)
5. **Test thoroughly** - App Store review is strict
6. **Plan for rejections** - First submission often needs revisions
7. **Budget time** - Review can take 1-5 days

---

## File Locations Reference

**Configuration Files:**
- `C:\Proyectos\smokelog\eas.json` - EAS build configuration
- `C:\Proyectos\smokelog\capacitor.config.ts` - Capacitor configuration
- `C:\Proyectos\smokelog\package.json` - Project metadata

**iOS Project:**
- `C:\Proyectos\smokelog\ios\App\` - Xcode project
- `C:\Proyectos\smokelog\ios\App\App\Info.plist` - iOS app info
- `C:\Proyectos\smokelog\ios\App\App\Assets.xcassets\` - iOS assets

**Build Output:**
- `C:\Proyectos\smokelog\dist\` - Web build output
- EAS builds: Downloaded from Expo dashboard

---

This guide will walk you through the entire iOS setup process from enrollment to App Store submission. Bookmark this document and refer back to it at each phase!
