import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.smokelog.app',
  appName: 'SmokeLog',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#c8eef7'
  },
  ios: {
    contentInset: 'automatic',
    backgroundColor: '#c8eef7',
    scheme: 'SmokeLog',
    limitsNavigationsToAppBoundDomains: true,
    scrollEnabled: true,
    allowsLinkPreview: false
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#c8eef7',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#c8eef7',
      overlaysWebView: false
    },
    Haptics: {
      enabled: true
    }
  }
};

export default config;
