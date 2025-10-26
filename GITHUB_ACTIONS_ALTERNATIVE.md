# GitHub Actions Alternative to Appflow

If you decide Appflow isn't right for you, here's how to set up free iOS builds using GitHub Actions.

## When to Choose GitHub Actions

### Choose GitHub Actions if:
- You want completely free builds (public repo)
- You're comfortable with YAML and CI/CD
- You want full control over the build process
- You don't mind longer setup time

### Choose Appflow if:
- You want the fastest setup (30 minutes)
- You prefer a GUI over YAML
- You want integrated Live Updates
- You value official Capacitor support

## Cost Comparison

| | GitHub Actions | Appflow Free | Appflow Growth |
|---|---|---|---|
| **Monthly Cost** | $0 (public) / $0.008/min (private) | $0 | $89 |
| **Build Minutes** | 2000/month (private) | Unlimited | Unlimited |
| **Concurrent Builds** | 20 | 1 | 3 |
| **Setup Complexity** | High | Low | Low |
| **Live Updates** | No | 500/month | 10,000/month |

## GitHub Actions Setup Guide

### Prerequisites

1. Repository must be on GitHub (you have this)
2. Apple Developer account (you have this)
3. Certificates and provisioning profiles (same as Appflow)
4. Fastlane configured

### Step 1: Install Fastlane Locally

Even though builds run in the cloud, set up Fastlane locally first:

```bash
# Install Ruby (required for Fastlane)
# Download from: https://rubyinstaller.org/downloads/

# Install Fastlane
gem install fastlane

# Initialize Fastlane in iOS folder
cd C:\Proyectos\smokelog\ios\App
fastlane init
```

### Step 2: Configure Fastlane Match

Fastlane Match stores your certificates in a private git repo (encrypted):

```bash
# Initialize Match
fastlane match init

# Choose git storage
# Create a private GitHub repo for certificates: smokelog-certificates
# Enter: https://github.com/adrianargaiz/smokelog-certificates.git

# Generate certificates
fastlane match adhoc
fastlane match appstore
```

### Step 3: Create GitHub Secrets

Go to GitHub repo → Settings → Secrets and variables → Actions

Add these secrets:

```
MATCH_PASSWORD: [password for encrypted certificates]
MATCH_GIT_BASIC_AUTHORIZATION: [base64 of username:personal_access_token]
APP_STORE_CONNECT_API_KEY_ID: [from App Store Connect]
APP_STORE_CONNECT_API_ISSUER_ID: [from App Store Connect]
APP_STORE_CONNECT_API_KEY_CONTENT: [base64 of .p8 file]
```

### Step 4: Create Fastlane Configuration

Create `C:\Proyectos\smokelog\ios\App\fastlane\Fastfile`:

```ruby
default_platform(:ios)

platform :ios do
  desc "Build iOS app"
  lane :build do
    setup_ci
    match(
      type: "adhoc",
      readonly: true,
      git_basic_authorization: ENV["MATCH_GIT_BASIC_AUTHORIZATION"]
    )

    gym(
      scheme: "App",
      export_method: "ad-hoc",
      output_directory: "./build",
      output_name: "SmokeLOG.ipa"
    )
  end

  desc "Build and upload to TestFlight"
  lane :beta do
    setup_ci
    match(
      type: "appstore",
      readonly: true,
      git_basic_authorization: ENV["MATCH_GIT_BASIC_AUTHORIZATION"]
    )

    gym(
      scheme: "App",
      export_method: "app-store",
      output_directory: "./build",
      output_name: "SmokeLOG.ipa"
    )

    upload_to_testflight(
      api_key_path: "./AppStoreAPIKey.json",
      skip_waiting_for_build_processing: true
    )
  end
end
```

### Step 5: Create GitHub Actions Workflow

Create `.github/workflows/ios-build.yml`:

```yaml
name: iOS Build

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-ios:
    runs-on: macos-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Build web app
      run: npm run build

    - name: Sync Capacitor
      run: npx cap sync ios

    - name: Setup Ruby
      uses: ruby/setup-ruby@v1
      with:
        ruby-version: '3.2'
        bundler-cache: true

    - name: Install Fastlane
      run: |
        cd ios/App
        bundle install

    - name: Build iOS app
      env:
        MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
        MATCH_GIT_BASIC_AUTHORIZATION: ${{ secrets.MATCH_GIT_BASIC_AUTHORIZATION }}
      run: |
        cd ios/App
        fastlane build

    - name: Upload IPA
      uses: actions/upload-artifact@v4
      with:
        name: SmokeLOG-iOS
        path: ios/App/build/SmokeLOG.ipa
        retention-days: 30
```

### Step 6: Trigger a Build

```bash
git add .
git commit -m "Add GitHub Actions iOS build"
git push origin main
```

Watch the build at: https://github.com/adrianargaiz/smokeLog/actions

### Step 7: Download and Install

1. Go to Actions tab in GitHub
2. Click on the latest successful workflow run
3. Download the "SmokeLOG-iOS" artifact
4. Extract the .ipa file
5. Install using Diawi or iTunes (same as Appflow)

## Advanced Features

### Automatic TestFlight Upload

Modify workflow to use the `beta` lane:

```yaml
    - name: Build and upload to TestFlight
      env:
        MATCH_PASSWORD: ${{ secrets.MATCH_PASSWORD }}
        MATCH_GIT_BASIC_AUTHORIZATION: ${{ secrets.MATCH_GIT_BASIC_AUTHORIZATION }}
        APP_STORE_CONNECT_API_KEY_ID: ${{ secrets.APP_STORE_CONNECT_API_KEY_ID }}
        APP_STORE_CONNECT_API_ISSUER_ID: ${{ secrets.APP_STORE_CONNECT_API_ISSUER_ID }}
        APP_STORE_CONNECT_API_KEY_CONTENT: ${{ secrets.APP_STORE_CONNECT_API_KEY_CONTENT }}
      run: |
        cd ios/App
        echo "$APP_STORE_CONNECT_API_KEY_CONTENT" | base64 -d > AppStoreAPIKey.json
        fastlane beta
```

### Version Bumping

Add automatic version increments:

```yaml
    - name: Bump build number
      run: |
        cd ios/App
        agvtool new-version -all ${{ github.run_number }}
```

### Conditional Builds

Only build on tags:

```yaml
on:
  push:
    tags:
      - 'v*'
```

### Slack Notifications

Add notification on success/failure:

```yaml
    - name: Slack Notification
      uses: 8398a7/action-slack@v3
      if: always()
      with:
        status: ${{ job.status }}
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

## Troubleshooting

### Build Fails: "No matching provisioning profiles"

```bash
# Regenerate profiles
fastlane match nuke development
fastlane match nuke adhoc
fastlane match adhoc --force_for_new_devices
```

### Build Fails: "Code signing identity not found"

Check that secrets are set correctly:
- `MATCH_PASSWORD`
- `MATCH_GIT_BASIC_AUTHORIZATION`

### Build Takes Too Long

GitHub Actions for private repos:
- 2000 minutes/month free
- Each iOS build: ~10-20 minutes
- ~100-200 builds/month

### Faster Builds with Caching

```yaml
    - name: Cache CocoaPods
      uses: actions/cache@v4
      with:
        path: ios/App/Pods
        key: ${{ runner.os }}-pods-${{ hashFiles('**/Podfile.lock') }}

    - name: Cache node modules
      uses: actions/cache@v4
      with:
        path: node_modules
        key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
```

## Comparison: GitHub Actions vs Appflow

### Setup Time
- **GitHub Actions**: 2-4 hours (Fastlane, YAML, secrets)
- **Appflow**: 30 minutes (GUI, upload certificates)

### Ease of Use
- **GitHub Actions**: Requires YAML, Fastlane, CLI knowledge
- **Appflow**: Point-and-click GUI

### Build Time
- **GitHub Actions**: 10-20 minutes (download deps each time)
- **Appflow**: 5-15 minutes (optimized for Capacitor)

### Cost (Private Repo)
- **GitHub Actions**:
  - Free: 2000 min/month = ~100-200 builds
  - Paid: $0.008/minute after
- **Appflow**:
  - Free: Unlimited builds (1 concurrent)
  - Growth: $89/month (3 concurrent)

### Features
| Feature | GitHub Actions | Appflow |
|---------|---------------|----------|
| iOS/Android builds | Yes | Yes |
| TestFlight upload | Yes (manual setup) | Yes (built-in) |
| Live Updates | No | Yes |
| Build automation | Yes | Yes |
| CLI control | Yes | Yes |
| GUI dashboard | No | Yes |
| Native monitoring | No | Yes (paid) |

### When to Use Each

**Use GitHub Actions if:**
- You're experienced with CI/CD
- You want complete control
- You have a public repo (unlimited builds)
- You don't need Live Updates
- You're comfortable with Fastlane

**Use Appflow if:**
- You want the fastest setup
- You prefer GUI over YAML
- You want Live Updates
- You value official support
- You want simpler certificate management

## Hybrid Approach

You can use both!

- **Development**: Use Appflow for quick testing
- **Production**: Use GitHub Actions for App Store releases
- **Live Updates**: Use Appflow's OTA updates

## My Recommendation

For SmokeLOG, I recommend starting with **Ionic Appflow** because:

1. **Fastest time to testing**: 30 min vs 2-4 hours
2. **Built for Capacitor**: Official support, optimized builds
3. **Free tier is sufficient**: Unlimited builds, 1 concurrent
4. **Live Updates**: Deploy web updates without app store review
5. **Less maintenance**: No YAML, Fastlane, or Ruby to manage

**Later**, if you need:
- More control → Add GitHub Actions
- Cost optimization → Use GitHub Actions for private repos
- Both → Use hybrid approach

But **start with Appflow** to get your app on your iPhone TODAY.

## Implementation Steps

If you choose GitHub Actions:

1. Follow setup guide above (2-4 hours)
2. Test build locally with Fastlane
3. Add GitHub secrets
4. Create workflow file
5. Push and test

If you choose Appflow:

1. Follow `APPFLOW_QUICKSTART.md` (30 minutes)
2. Test on iPhone
3. Iterate and improve
4. Add GitHub Actions later if needed

## Resources

- GitHub Actions Docs: https://docs.github.com/en/actions
- Fastlane Docs: https://docs.fastlane.tools/
- Fastlane Match: https://docs.fastlane.tools/actions/match/
- Capacitor CI/CD: https://capacitorjs.com/docs/guides/ci-cd
- iOS Code Signing Guide: https://docs.fastlane.tools/codesigning/getting-started/

---

**My final recommendation**: Start with Appflow (30 min), get your app working on iPhone, then evaluate if you need GitHub Actions later. Don't over-engineer on day one!
