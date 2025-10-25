# iOS Quick Start - Do These Now!

## Step 1: Enroll in Apple Developer Program (Required - Do First!)

1. Go to: **https://developer.apple.com/programs/enroll/**
2. Click "Start Your Enrollment"
3. Sign in with your Apple ID
4. Choose "Individual" (recommended for faster approval)
5. Complete the form with your information
6. Pay $99/year
7. Wait 24-48 hours for approval email

**What to watch for:**
- Email: "Welcome to the Apple Developer Program" (approval)
- Check spam/junk folders if not received in 48 hours

---

## Step 2: Initialize EAS Project (Do While Waiting)

Open terminal and run these commands:

```bash
# Navigate to project
cd C:\Proyectos\smokelog

# Initialize EAS project
eas init
```

When prompted: "Would you like to create a project for @adrianargaiz/smokelog?"
**Answer: y** (yes)

---

## Step 3: Build iOS Simulator (Test Immediately!)

```bash
# Make sure web build is current
npm run build

# Sync to iOS
npx cap sync ios

# Build for simulator
eas build --platform ios --profile simulator
```

**Expected:**
- Build takes 10-15 minutes
- You'll get a download link when complete
- Can test on Mac with Xcode Simulator

---

## Step 4: While Waiting for Apple Approval

### Test on Android:
```bash
npm run android:run
```

### Test in Browser:
```bash
npm run dev
# Open http://localhost:5173
# Press F12, click mobile icon, select iPhone
```

### Read iOS Guidelines:
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/ios
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

### Prepare Assets:
- App icon (1024x1024 PNG) - already have basic one
- App Store screenshots (prepare for later)
- App description and keywords
- Privacy policy (if collecting user data)

---

## Step 5: After Apple Approval (Return Here!)

When you get the approval email:

1. **Verify access:**
   - Visit: https://developer.apple.com/account
   - Confirm "Active" status
   - Note your Team ID

2. **Come back to this chat and let me know!**
   - I'll help configure certificates
   - Set up device builds
   - Submit to TestFlight
   - Prepare App Store submission

---

## Commands Summary

```bash
# Check if logged into EAS
eas whoami

# Initialize EAS (one-time)
eas init

# Build simulator (test now!)
eas build --platform ios --profile simulator

# Build for device (after Apple approval)
eas build --platform ios --profile development

# Production build (for App Store)
eas build --platform ios --profile production

# Submit to App Store (final step)
eas submit --platform ios
```

---

## Timeline

- **Today**: Enroll, pay $99, run `eas init`, build simulator
- **24-48 hours**: Apple processes enrollment
- **Day 3**: Approval received, configure certificates
- **Week 1**: Development builds, internal testing
- **Week 2-3**: TestFlight beta testing
- **Week 4**: App Store submission
- **Week 5**: App Store approval and launch

---

## Current Status

- Project: SmokeLog (com.smokelog.app)
- EAS Account: adrianargaiz
- Git Repository: Initialized
- Configuration: Ready
- Simulator Profile: Configured

**Ready for:**
1. Apple Developer enrollment
2. EAS project initialization (`eas init`)
3. First simulator build

---

## Need Help?

**Full detailed guide:** See `IOS-SETUP-GUIDE.md` in this folder

**Questions?** Come back to this chat and ask!

---

## Quick Troubleshooting

**"Git not clean" error?**
```bash
git add .
git commit -m "Your message"
```

**"Not logged into EAS"?**
```bash
eas login
```

**"Project not configured"?**
```bash
eas init
```

**Build failed?**
```bash
npm run build
npx cap sync ios
git add . && git commit -m "Rebuild"
eas build --platform ios --profile simulator
```

---

Start with Step 1 now - enroll in Apple Developer Program!
While you wait for approval, complete Steps 2 and 3 to get simulator builds running.
