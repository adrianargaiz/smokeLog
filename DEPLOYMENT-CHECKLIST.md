# iOS Deployment Checklist - SmokeLog

Your Apple Developer account is approved! Follow this checklist to get your app live.

---

## Pre-Deployment Checklist

### Apple Developer Account Setup

- [ ] **Verify Apple Developer Account Active**
  - Visit: https://developer.apple.com/account
  - Confirm "Active" membership status
  - Note your Team ID: `_____________`

- [ ] **Create App Store Connect Record**
  - Visit: https://appstoreconnect.apple.com
  - Click "My Apps" → "+" → "New App"
  - Platform: iOS
  - Name: SmokeLog (or your choice)
  - Bundle ID: com.smokelog.app
  - SKU: smokelog-001
  - Note App Store Connect ID: `_____________`

- [ ] **Update eas.json with Your Details**
  - Edit: `C:\Proyectos\smokelog\eas.json`
  - Replace `your-apple-id@example.com` with your Apple ID
  - Replace `your-app-store-connect-id` with numeric ID from App Store Connect
  - Replace `your-team-id` with Team ID from developer.apple.com

### EAS Authentication

- [ ] **Authenticate EAS with Apple Developer Account**
  ```bash
  cd C:\Proyectos\smokelog
  eas device:create
  ```
  - Sign in with your Apple ID when prompted
  - Authorize EAS to manage certificates

### Code Preparation

- [ ] **Ensure code is committed**
  ```bash
  git status
  git add .
  git commit -m "Prepare for production build"
  git push
  ```

---

## Build & Submit Checklist

### Production Build

- [ ] **Create production build**
  ```bash
  cd C:\Proyectos\smokelog
  npm run ios:build:prod
  ```
  - Wait 15-25 minutes for build to complete
  - Note build URL: `_____________`
  - Download IPA (optional, for records)

- [ ] **Verify build success**
  ```bash
  eas build:list --platform ios
  ```
  - Status should show "Finished" with green checkmark
  - No errors in build logs

### App Store Submission

- [ ] **Submit build to App Store Connect**
  ```bash
  eas submit --platform ios --latest
  ```
  - Wait 5-10 minutes for upload
  - Build appears in App Store Connect

- [ ] **Wait for build processing**
  - Visit App Store Connect → TestFlight → iOS Builds
  - Status changes from "Processing" → "Ready to Submit"
  - Takes 10-30 minutes

- [ ] **Answer export compliance questions**
  - In TestFlight, click on build version
  - "Does your app use encryption?" → No (unless custom encryption added)
  - Submit

---

## App Store Listing Checklist

### Required Information

- [ ] **App Information**
  - Name: SmokeLog
  - Subtitle: `_____________`
  - Privacy Policy URL: `_____________` (required if collecting data)
  - Category: Health & Fitness

- [ ] **Screenshots** (REQUIRED)
  - [ ] iPhone 6.7" Display (1290 x 2796) - minimum 3, up to 10
  - [ ] iPhone 6.5" Display (1242 x 2688) - minimum 3, up to 10

  **Screenshot suggestions:**
  1. Main dashboard showing smoke-free progress
  2. Health improvements/savings screen
  3. Statistics/charts view
  4. Milestone/achievement view
  5. Settings or profile screen

- [ ] **Description** (REQUIRED)
  ```
  Write compelling description (max 4000 characters)
  Focus on benefits: quit smoking, track progress, stay motivated
  Include key features list
  ```

- [ ] **Keywords** (REQUIRED)
  ```
  Max 100 characters, comma-separated
  Suggestion: quit smoking, stop smoking, smoking cessation, health tracker, smoke free
  ```

- [ ] **Support URL** (REQUIRED)
  - Your website or GitHub repo
  - URL: `_____________`

- [ ] **Marketing URL** (Optional)
  - Promotional website
  - URL: `_____________`

### Version Information

- [ ] **Build selection**
  - Click "+" next to Build
  - Select build 1.0.0 (1)

- [ ] **Copyright**
  - Format: 2025 [Your Name/Company]
  - Copyright: `_____________`

### App Review Information

- [ ] **Contact information**
  - Email: `_____________`
  - Phone: `_____________`

- [ ] **Demo account** (if app requires login)
  - Username: `_____________`
  - Password: `_____________`
  - Or select "No login required"

- [ ] **Notes for reviewer**
  - Any special instructions
  - How to test key features

- [ ] **Age rating**
  - Complete questionnaire
  - Expected rating: 4+ (for health apps)

### Pricing & Availability

- [ ] **Price**
  - Free (recommended for v1.0)
  - Or set price: `_____________`

- [ ] **Availability**
  - All countries
  - Or select specific territories

---

## Pre-Submission Review

Before clicking "Submit for Review":

- [ ] All required fields filled in App Store Connect
- [ ] Screenshots uploaded and look good
- [ ] Description is clear and compelling
- [ ] No placeholder text remaining
- [ ] Build is selected
- [ ] Export compliance answered
- [ ] Contact information correct
- [ ] Age rating completed

---

## Submit for Review

- [ ] **Choose release method**
  - [ ] Manually release this version (RECOMMENDED for first release)
  - [ ] Automatically release after approval

- [ ] **Submit**
  - Click "Add for Review" (top right)
  - Review summary
  - Click "Submit for Review"
  - Note submission date: `_____________`

---

## Post-Submission Monitoring

### During Review (3-5 days average)

- [ ] **Monitor status**
  - App Store Connect → My Apps → SmokeLog
  - Status progression:
    - "Waiting for Review" (24-48 hours)
    - "In Review" (1-3 days)
    - "Pending Developer Release" or "Ready for Sale"

- [ ] **Check email for updates**
  - Approval notification
  - Or rejection with reasons

### If Approved

- [ ] **Release app** (if manual release selected)
  - Click "Release this Version"
  - App goes live in 1-2 hours

- [ ] **Verify app is live**
  - Search App Store for "SmokeLog"
  - Confirm app appears correctly
  - Test download and installation

- [ ] **Monitor initial reviews**
  - App Store Connect → Ratings & Reviews
  - Respond to user feedback

### If Rejected

- [ ] **Read rejection reasons carefully**
- [ ] **Address all issues**
- [ ] **Resubmit**
  - If code changes needed: new build + resubmit
  - If metadata issues only: update in App Store Connect + resubmit

---

## Optional: TestFlight Beta Testing

Before final App Store submission:

- [ ] **Enable TestFlight**
  - Answer export compliance
  - Add internal testers (up to 100)
  - They can test immediately (no review needed)

- [ ] **Internal testing**
  - Add your email to test on your iPhone
  - Invite team members or friends
  - Collect feedback

- [ ] **External testing** (optional)
  - Create external testing group
  - Submit for Beta App Review (1-2 days)
  - Invite up to 10,000 testers
  - Great for larger beta programs

---

## Timeline Estimate

- **Today**: Complete Apple setup, build, and submit (2-3 hours active work)
- **Day 1**: Build processing and App Store Connect setup complete
- **Days 1-2**: Optional TestFlight beta testing
- **Days 3-7**: App Store review process
- **Day 7**: App approved and live in App Store

---

## Quick Command Reference

```bash
# Navigate to project
cd C:\Proyectos\smokelog

# Build production IPA
npm run ios:build:prod

# Check build status
eas build:list --platform ios

# Submit to App Store
eas submit --platform ios --latest

# Check EAS authentication
eas whoami

# View project info
eas project:info
```

---

## Current Status

- Project: SmokeLog
- Bundle ID: com.smokelog.app
- Version: 1.0.0
- Build Number: 1
- EAS Account: adrianargaiz
- EAS Project: @adrianargaiz/smokelog
- Apple Developer: APPROVED ✓

**You are here:** Ready to configure Apple Developer credentials and start first build!

---

## Need Help?

- **Full guide**: See `DEPLOYMENT-GUIDE.md` for detailed instructions
- **Quick start**: See `IOS-QUICK-START.md` for overview
- **Questions**: Come back to the chat and ask!

---

## Notes Section

Use this space for your own notes during deployment:

```
Team ID: _________________

App Store Connect ID: _________________

Build URL: _________________

Submission Date: _________________

Approval Date: _________________

Release Date: _________________

Issues encountered:
-
-
-

```

---

Start with the "Pre-Deployment Checklist" section and work through each item!
