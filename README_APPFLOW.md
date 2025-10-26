# SmokeLOG - Ionic Appflow Build Setup

Complete guide for building and testing your iOS app on Windows using Ionic Appflow.

## Quick Links

- **30-Minute Quick Start**: [APPFLOW_QUICKSTART.md](./APPFLOW_QUICKSTART.md)
- **Detailed Setup Guide**: [IONIC_APPFLOW_SETUP.md](./IONIC_APPFLOW_SETUP.md)
- **Why Not EAS Build**: [WHY_APPFLOW_NOT_EAS.md](./WHY_APPFLOW_NOT_EAS.md)
- **GitHub Actions Alternative**: [GITHUB_ACTIONS_ALTERNATIVE.md](./GITHUB_ACTIONS_ALTERNATIVE.md)

## What's Been Set Up

### 1. Ionic CLI Installed
```bash
ionic --version
# Output: 7.2.1
```

### 2. Project Configuration
- Created `ionic.config.json` - Links project to Appflow
- Updated `package.json` - Added Appflow scripts
- Updated `.gitignore` - Prevents committing certificates

### 3. Helper Scripts
- `generate-certificates.bat` - Windows batch script for certificates
- `generate-certificates.ps1` - PowerShell script for certificates

### 4. Documentation
- Complete setup guides
- Troubleshooting help
- Alternative solutions

## Your Current Setup

```
App Name: SmokeLOG
Bundle ID: com.smokelog.app
Version: 1.0.0
Platform: Windows (requires cloud Mac builds)

Tech Stack:
- React 19.1.1
- Vite 7.1.7
- Capacitor 7.4.3
- TypeScript 5.9.3

Repository: https://github.com/adrianargaiz/smokeLog
Apple Developer: Approved and ready
```

## Next Steps (Choose Your Path)

### Path 1: Ionic Appflow (RECOMMENDED - 30 minutes)

1. **Read the quick start**:
   ```bash
   # Open this file
   APPFLOW_QUICKSTART.md
   ```

2. **Create Appflow account**:
   - Go to: https://ionic.io/appflow
   - Sign up (FREE tier)

3. **Generate certificates**:
   ```powershell
   # Run in PowerShell
   .\generate-certificates.ps1
   ```

4. **Follow the guide**:
   - Upload certificates to Appflow
   - Trigger your first build
   - Install on iPhone

5. **Done!** App on your iPhone in 30 minutes.

### Path 2: GitHub Actions (FREE - 2-4 hours)

1. **Read the alternative guide**:
   ```bash
   # Open this file
   GITHUB_ACTIONS_ALTERNATIVE.md
   ```

2. **Set up Fastlane**:
   - Install Ruby
   - Configure Fastlane Match
   - Create GitHub secrets

3. **Create workflow**:
   - Add `.github/workflows/ios-build.yml`
   - Configure build pipeline

4. **Done!** Free builds on every push.

## Available NPM Scripts

### Appflow Commands
```bash
# Link local project to Appflow
npm run appflow:link

# View build history
npm run appflow:builds

# Trigger iOS build
npm run appflow:build:ios

# Deploy build
npm run appflow:deploy
```

### Development Commands
```bash
# Run development server
npm run dev

# Build web app
npm run build

# Sync Capacitor
npm run cap:sync

# Sync iOS specifically
npm run ios:sync
```

## Certificate Management

### IMPORTANT: Never Commit These Files!

The `.gitignore` has been configured to prevent committing:
- `*.p12` - Your signing certificate
- `*.cer` - Certificate files
- `*.key` - Private keys
- `*.csr` - Certificate signing requests
- `*.mobileprovision` - Provisioning profiles

### Safe Certificate Storage

Store certificates in a secure location:
```
C:\Users\[YourName]\Documents\SmokeLOG-Certificates\
├── distribution.p12
├── SmokeLOG.key
├── SmokeLOG_AdHoc.mobileprovision
└── password.txt (with strong password)
```

## Troubleshooting

### Issue: "ionic: command not found"

**Solution**: Ionic CLI installed globally, but shell needs refresh
```bash
# Close and reopen your terminal
# OR run:
npm install -g @ionic/cli
```

### Issue: "OpenSSL not found" when generating certificates

**Solution**: Install Git for Windows (includes OpenSSL)
- Download: https://git-scm.com/download/win
- Or use WSL (Windows Subsystem for Linux)

### Issue: Build fails in Appflow

**Solution**: Check build logs for specific error
- Common causes:
  - Missing dependencies in package.json
  - Certificate mismatch
  - Incorrect Bundle ID
  - Expired provisioning profile

### Issue: Can't install app on iPhone

**Solution**: Verify device UDID is in provisioning profile
```bash
# Get UDID from:
# 1. https://www.whatismyudid.com/
# 2. iTunes when iPhone connected
# 3. Xcode Devices window (if you had Mac)
```

### Issue: "expo" package causing confusion

**Solution**: Safe to remove (not used in Capacitor apps)
```bash
npm uninstall expo
git add package.json package-lock.json
git commit -m "Remove unused expo dependency"
git push
```

## Cost Breakdown

### Ionic Appflow - FREE Tier
- **Cost**: $0/month
- **Builds**: Unlimited (1 concurrent)
- **Live Updates**: 500/month
- **Support**: Community
- **Perfect for**: Testing and development

### Ionic Appflow - Growth Plan
- **Cost**: $89/month
- **Builds**: Unlimited (3 concurrent)
- **Live Updates**: 10,000/month
- **Support**: Standard
- **Perfect for**: Production apps with team

### GitHub Actions (Alternative)
- **Cost**: $0 (public repo) or 2000 min/month (private)
- **Builds**: ~100-200/month (private repo)
- **Setup**: More complex
- **Perfect for**: Budget-conscious developers

### Recommendation
Start with Appflow FREE tier. Upgrade only if you need:
- Faster builds (multiple concurrent)
- More Live Updates
- Priority support

## Support and Resources

### Ionic Appflow
- Dashboard: https://dashboard.ionicframework.com
- Documentation: https://ionic.io/docs/appflow
- Community Forum: https://forum.ionicframework.com/

### Capacitor
- Documentation: https://capacitorjs.com/docs
- iOS Guide: https://capacitorjs.com/docs/ios
- Plugins: https://capacitorjs.com/docs/plugins

### Apple Developer
- Portal: https://developer.apple.com/account
- App Store Connect: https://appstoreconnect.apple.com
- Certificates: https://developer.apple.com/account/resources/certificates
- Profiles: https://developer.apple.com/account/resources/profiles

### This Project
- Repository: https://github.com/adrianargaiz/smokeLog
- Issues: https://github.com/adrianargaiz/smokeLog/issues

## Files Created for You

```
C:\Proyectos\smokelog\
├── ionic.config.json                    # Appflow project config
├── APPFLOW_QUICKSTART.md                # 30-minute setup guide
├── IONIC_APPFLOW_SETUP.md               # Detailed setup guide
├── WHY_APPFLOW_NOT_EAS.md               # Why not EAS Build
├── GITHUB_ACTIONS_ALTERNATIVE.md        # Free alternative
├── README_APPFLOW.md                    # This file
├── generate-certificates.bat            # Windows batch script
├── generate-certificates.ps1            # PowerShell script
├── package.json (updated)               # Added Appflow scripts
└── .gitignore (updated)                 # Protect certificates
```

## Project Status

- [x] Ionic CLI installed globally
- [x] Project configured for Appflow
- [x] Documentation created
- [x] Helper scripts ready
- [x] Git repository ready
- [ ] Appflow account created (YOUR ACTION)
- [ ] Certificates generated (YOUR ACTION)
- [ ] First build triggered (YOUR ACTION)
- [ ] App installed on iPhone (YOUR ACTION)

## Timeline to First Install

### Using Appflow (RECOMMENDED)
1. Create account: 5 minutes
2. Connect repository: 3 minutes
3. Generate certificates: 15 minutes
4. Upload to Appflow: 3 minutes
5. Trigger build: 2 minutes
6. Build completes: 10 minutes
7. Install on iPhone: 5 minutes

**Total: ~45 minutes** (30 minutes active work + 10 minutes build time)

### Using GitHub Actions
1. Setup Fastlane: 30 minutes
2. Configure Match: 30 minutes
3. Create workflow: 20 minutes
4. Configure secrets: 10 minutes
5. Test build: 20 minutes

**Total: ~2 hours** (initial setup)

## Recommended Workflow

### For Daily Development

1. **Make changes locally**:
   ```bash
   npm run dev
   # Test in browser
   ```

2. **Commit and push**:
   ```bash
   git add .
   git commit -m "Add new feature"
   git push origin main
   ```

3. **Build in Appflow**:
   - Automatic (if automation enabled)
   - OR manual trigger in dashboard
   - OR `npm run appflow:build:ios`

4. **Test on iPhone**:
   - Download IPA
   - Install via Diawi or TestFlight
   - Test all features

5. **Iterate**:
   - Fix bugs
   - Repeat process

### For Production Release

1. **Final testing on iPhone**
2. **Create App Store build** (not Ad Hoc)
3. **Upload to TestFlight** via Appflow
4. **Beta test** with internal testers
5. **Submit to App Store** for review
6. **Publish** when approved

## Security Best Practices

### DO:
- Keep `.p12` password in password manager
- Store certificates in secure location
- Use strong passwords for certificates
- Enable 2FA on Apple Developer account
- Regularly rotate certificates (yearly)
- Backup certificates securely

### DON'T:
- Commit certificates to git
- Share certificates via email
- Use weak passwords
- Store passwords in plain text
- Share provisioning profiles publicly

## FAQ

**Q: Do I need a Mac?**
A: No! Appflow provides cloud Mac builds.

**Q: Can I test on Android too?**
A: Yes! Appflow supports Android builds.

**Q: How much does it cost?**
A: FREE tier is perfect for testing. $89/month if you need more.

**Q: Can I use my existing Apple Developer account?**
A: Yes! Any Apple Developer account works.

**Q: What if I already have certificates?**
A: You can upload existing certificates to Appflow.

**Q: Can I switch from Appflow to GitHub Actions later?**
A: Yes! You can use both or switch anytime.

**Q: Does Appflow support Live Updates like EAS?**
A: Yes! Appflow has Live Updates (similar to EAS Update).

**Q: How long do builds take?**
A: Typically 5-15 minutes for iOS.

**Q: Can I cancel anytime?**
A: Yes! No long-term contracts.

**Q: What if I need help?**
A: Free tier has community support. Paid plans have priority support.

## Congratulations!

You're all set up to build and test SmokeLOG on your iPhone!

### Your Next Action

**Open APPFLOW_QUICKSTART.md and follow the 30-minute guide!**

```bash
# In VS Code
code APPFLOW_QUICKSTART.md

# Or just open it
start APPFLOW_QUICKSTART.md
```

---

**Created**: 2025-10-26
**For**: SmokeLOG v1.0.0
**Platform**: iOS on Windows via Ionic Appflow
**Time to first install**: ~30 minutes

Good luck! You'll have your app on your iPhone very soon!
