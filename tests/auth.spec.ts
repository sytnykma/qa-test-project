import { test, expect } from './fixtures';

test.describe('Module 1 - Authentication & UI Settings', () => {

  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('LOGIN-02: Authentication – Successful Registration & Login', async ({ loginPage }) => {
    const uniqueUser = `TestUser_${Date.now()}`;
    
    // Perform registration / login
    await loginPage.createAccount(uniqueUser);
    
    // Check that login input is no longer visible, meaning user successfully entered the app
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
});