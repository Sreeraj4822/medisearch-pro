import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sreeraj.medisearch',
  appName: 'MediSearch Pro',
  webDir: 'out',
  server: {
    url: 'https://medisearch-pro.vercel.app',
    cleartext: false
  }
};

export default config;