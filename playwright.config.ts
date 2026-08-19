import { defineConfig, devices } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

const htmlPath = path.resolve(__dirname, 'index.html');
const fileUrl = pathToFileURL(htmlPath).href;

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: false,
  workers: 1, // Запускаем строго в один поток, чтобы не плодить окна
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
});