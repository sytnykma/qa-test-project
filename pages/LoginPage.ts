// pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';
import path from 'path';
import { pathToFileURL } from 'url';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly loginButton: Locator;
  readonly createAccountButton: Locator;
  readonly themeButton: Locator;
  readonly languageSelect: Locator;
  readonly errorMessage: Locator;
  readonly toggleModeButton: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    
    this.usernameInput = page.getByRole('textbox', { name: /name/i }).or(page.locator('input[type="text"]'));
    this.loginButton = page.getByRole('button', { name: /log in|login|ورود/i }).and(page.locator('button[type="submit"]'));
    this.createAccountButton = page.getByRole('button', { name: /create account|حساب/i });
    this.themeButton = page.getByTestId('btn-theme');
    this.languageSelect = page.getByTestId('select-language');
    this.errorMessage = page.locator('.alert--error');
    this.toggleModeButton = page.getByTestId('btn-switch-mode');
    this.logoutButton = page.getByRole('button', { name: /Log Out|خروج/i });
  }

  async goto() {
    const filePath = path.resolve(__dirname, '../index.html');
    await this.page.goto(pathToFileURL(filePath).href);
  }

  async createAccount(username: string) {
    await this.usernameInput.fill(username);
    await this.createAccountButton.click();
  }

  async switchTheme() {
    await this.themeButton.first().click();
  }

  async setLanguage(lang: string) {
    await this.languageSelect.selectOption(lang);
  }

  async isUserLoggedIn(): Promise<boolean> {
    return await this.logoutButton.isVisible();
  }
}