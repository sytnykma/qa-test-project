const fs = require('fs');
const path = require('path');

// Структура директорий
const dirs = ['tests', 'pages'];

// Создаем папки
dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
});

// Содержимое файлов
const files = {
    'playwright.config.ts': `import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: { timeout: 5000 },
  fullyParallel: true,
  reporter: 'html',
  use: {
    actionTimeout: 0,
    trace: 'on-first-retry',
    // Указываем путь к локальному файлу index.html
    baseURL: \`file://\${path.join(__dirname, 'index.html')}\`, 
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } }
  ],
});
`,

    'pages/LoginPage.ts': `import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly loginButton: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    // Базовые селекторы (нужно будет уточнить по реальному DOM)
    this.usernameInput = page.locator('input'); 
    this.loginButton = page.locator('button:has-text("Login")');
    this.createAccountButton = page.locator('button:has-text("Create Account")');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string) {
    await this.usernameInput.fill(username);
    await this.loginButton.click();
  }
}
`,

    'pages/GamePage.ts': `import { Page, Locator } from '@playwright/test';

export class GamePage {
  readonly page: Page;
  readonly boardCells: Locator;
  readonly hintButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.boardCells = page.locator('.cell'); // Пример класса ячейки
    this.hintButton = page.locator('button:has-text("Hint")');
    this.logoutButton = page.locator('button:has-text("Logout")');
  }
}
`,

    'pages/ProfilePage.ts': `import { Page, Locator } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  
  constructor(page: Page) {
    this.page = page;
  }
}
`,

    'tests/auth.spec.ts': `import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Module 1 - Authentication', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TS-01: Should create a new account successfully', async () => {
    // Здесь будем писать шаги теста
  });
});
`
};

// Создаем файлы
Object.entries(files).forEach(([filePath, content]) => {
    const fullPath = path.join(__dirname, filePath);
    if (!fs.existsSync(fullPath)) {
        fs.writeFileSync(fullPath, content, 'utf8');
        console.log(`📄 Created file: ${filePath}`);
    } else {
        console.log(`⏩ Skipped (already exists): ${filePath}`);
    }
});

console.log('✅ Project architecture bootstrapped successfully!');