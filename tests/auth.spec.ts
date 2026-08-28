import { expect } from '@playwright/test';
import { test } from './fixtures/baseTest';

test.describe('Module 1 - Authentication & UI Settings', () => {
  const testUser = 'TestUser123';
  const testPass = 'password123';

  test.beforeEach(async ({ page, loginPage }) => {
    await loginPage.goto();
    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.reload();
  });

  test('LOGIN-01: Failed Login / Input Validation', async ({ loginPage }) => {
    await loginPage.toggleModeButton.click();
    await loginPage.loginButton.click();
    
    await expect(loginPage.usernameInput).toBeVisible();

    await loginPage.usernameInput.fill('NonExistentUser123');
    await loginPage.loginButton.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('No account');
  });

  test('LOGIN-02: Authentication – Successful Registration & Login', async ({ page, loginPage }) => {
    const uniqueUser = `TestUser_${Date.now()}`;
    
    await loginPage.createAccount(uniqueUser);
    
    await expect(loginPage.usernameInput).not.toBeVisible({ timeout: 5000 });
  });

  test('LOGIN-03: UI – Theme Switcher Functionality', async ({ page, loginPage }) => {
    const htmlTag = page.locator('html');
    await expect(htmlTag).toHaveAttribute('data-theme', 'light');
    
    await loginPage.switchTheme();
    await expect(htmlTag).toHaveAttribute('data-theme', 'dark');
  });

  test('LOGIN-04: UI – Language Switcher (English to Persian / RTL Layout)', async ({ page, loginPage }) => {
    const htmlTag = page.locator('html');
    
    await loginPage.setLanguage('fa');
    
    await expect(htmlTag).toHaveAttribute('lang', 'fa');
    await expect(htmlTag).toHaveAttribute('dir', 'rtl');
  });

  test('LOGIN-05: UI – Keyboard Navigation (Accessibility)', async ({ page, loginPage }) => {
    await loginPage.usernameInput.focus();
    await expect(loginPage.usernameInput).toBeFocused();

    await loginPage.toggleModeButton.focus();
    await expect(loginPage.toggleModeButton).toBeFocused();

    await loginPage.createAccountButton.focus();
    await expect(loginPage.createAccountButton).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('LOGIN-06: Registration – Duplicate Username Prevention', async ({ page, loginPage }) => {
    const uniqueUser = `TestUser_${Date.now()}`;
    
    await loginPage.createAccount(uniqueUser);
    await expect(loginPage.usernameInput).not.toBeVisible();
    
    await loginPage.logoutButton.click();
    await expect(loginPage.usernameInput).toBeVisible();

    await loginPage.createAccount(uniqueUser);

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('taken');
  });

  test('LOGIN-07: Session Management – Persistence on Page Reload', async ({ page, loginPage }) => {
    const uniqueUser = `TestUser_${Date.now()}`;
    
    await loginPage.createAccount(uniqueUser);
    await expect(loginPage.usernameInput).not.toBeVisible();
    
    await page.reload();

    await expect(loginPage.usernameInput).not.toBeVisible();
    await expect(loginPage.logoutButton).toBeVisible();
  });
});