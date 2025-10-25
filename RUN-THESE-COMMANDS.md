# Commands to Run Now

## Terminal Commands for SmokeLog iOS Setup

Copy and paste these commands into your terminal (Command Prompt or PowerShell on Windows).

---

## 1. Initialize EAS Project

```cmd
cd C:\Proyectos\smokelog
eas init
```

**When prompted:** "Would you like to create a project for @adrianargaiz/smokelog?"
**Type:** `y` and press Enter

**Expected output:**
```
✔ Created @adrianargaiz/smokelog
✔ Linked local project to EAS project
```

---

## 2. Verify EAS Configuration

```cmd
eas project:info
```

**Expected output:**
```
Project: smokelog
Owner: adrianargaiz
Slug: smokelog
```

---

## 3. Build Web Assets

```cmd
npm run build
```

**Expected output:**
```
✓ built in X.XXs
```

---

## 4. Sync with iOS

```cmd
npx cap sync ios
```

**Expected output:**
```
✔ Copying web assets...
✔ Updating iOS plugins...
✔ Sync finished
```

---

## 5. Build iOS Simulator

```cmd
eas build --platform ios --profile simulator
```

**What happens:**
1. EAS uploads your project (may take a few minutes)
2. Builds iOS simulator app on EAS servers (10-15 minutes)
3. Provides download link when complete

**Expected output:**
```
✔ Build successful
Download: https://expo.dev/accounts/adrianargaiz/projects/smokelog/builds/[build-id]
```

---

## While Build is Running

The simulator build takes 10-15 minutes. While waiting:

### Test on Android:
```cmd
npm run android:run
```

### Test in Browser:
```cmd
npm run dev
```
Then open: http://localhost:5173

### Check Build Status:
```cmd
eas build:list
```

---

## After Simulator Build Completes

1. Download the file from the link provided
2. If you have a Mac:
   - Extract: `tar -xvf [filename].tar.gz`
   - Open Xcode Simulator
   - Drag .app file onto simulator
   - Test!

3. If you don't have a Mac:
   - Continue testing on Android and browser
   - Wait for Apple Developer approval for device builds

---

## Troubleshooting Commands

### If you see "Git not clean":
```cmd
git status
git add .
git commit -m "Updates for iOS build"
```

### If you see "Not logged in":
```cmd
eas login
```

### If build fails:
```cmd
eas build:view [build-id]
```
This shows detailed logs.

### Check what went wrong:
```cmd
eas build:list
```
Lists all your builds with their status.

---

## Apple Developer Enrollment (Do This Now!)

While your simulator build runs, enroll in the Apple Developer Program:

1. Open browser: **https://developer.apple.com/programs/enroll/**
2. Click "Start Your Enrollment"
3. Sign in with Apple ID
4. Complete enrollment form
5. Pay $99
6. Wait for approval email (24-48 hours)

---

## Summary

Run these in order:
1. `eas init` (one-time setup)
2. `npm run build` (build web assets)
3. `npx cap sync ios` (sync to iOS)
4. `eas build --platform ios --profile simulator` (build for simulator)

Then start Apple Developer enrollment while waiting for build to complete.

---

## Next Steps After Approval

When you receive the "Welcome to the Apple Developer Program" email:

1. Come back to this chat
2. Let me know you're approved
3. I'll provide the next set of commands for:
   - Certificate configuration
   - Device registration
   - Development builds
   - TestFlight setup
   - App Store submission

---

Ready? Start with command #1 above!
