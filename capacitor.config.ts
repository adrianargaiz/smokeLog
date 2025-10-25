import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smokelog.app',
  appName: 'SmokeLog',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#ffffff'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#ffffff',
    scheme: 'SmokeLog',
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true,
    allowsLinkPreview: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#ffffff',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#3b82f6',
      overlaysWebView: false
    },
    Haptics: {
      enabled: true
    }
  }
};

export default config;
