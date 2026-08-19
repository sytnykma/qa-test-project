import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Module 1 - Authentication & UI Settings', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('TS-01 & TS-03: Should successfully create account and login', async ({ page }) => {
    const uniqueUser = `TestUser_${Date.now()}`;
    
    // Perform registration / login
    await loginPage.createAccount(uniqueUser);
    
    // Check that login input is no longer visible, meaning user successfully entered the app
    await expect(loginPage.usernameInput).not.toBeVisible({ timeout: 5000 });
  });

  test('TS-06: Should toggle theme between light and dark', async ({ page }) => {
    const htmlTag = page.locator('html');
    await expect(htmlTag).toHaveAttribute('data-theme', 'light');
    
    await loginPage.switchTheme();
    await expect(htmlTag).toHaveAttribute('data-theme', 'dark');
  });

  test('TS-07: Should switch language to Persian and update direction to RTL', async ({ page }) => {
    const htmlTag = page.locator('html');
    
    await loginPage.setLanguage('fa');
    
    await expect(htmlTag).toHaveAttribute('lang', 'fa');
    await expect(htmlTag).toHaveAttribute('dir', 'rtl');
  });
});