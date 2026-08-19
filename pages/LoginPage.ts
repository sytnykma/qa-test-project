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

  constructor(page: Page) {
    this.page = page;
    // Используем более точные селекторы для инпута и кнопок
    this.usernameInput = page.locator('input[type="text"], input');
    this.loginButton = page.locator('button:has-text("Login")');
    this.createAccountButton = page.locator('button:has-text("Create Account")');
    this.themeButton = page.locator('#btn-theme, button[title*="theme"], button[aria-label*="theme"]');
    this.languageSelect = page.locator('select');
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
    const logoutBtn = this.page.locator('button:has-text("Logout"), button:has-text("Выйти"), #btn-logout');
    return await logoutBtn.isVisible();
  }
}