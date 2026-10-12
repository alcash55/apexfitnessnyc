import { defineConfig } from '@playwright/test';
import config from './playwright.config';

// Check the same server developers see, without launching a second server.
export default defineConfig({
  ...config,
  webServer: undefined,
  use: {
    ...config.use,
    baseURL: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
  },
});
