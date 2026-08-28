import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';
import { GamePage } from '../../pages/GamePage';
import { ProfilePage } from '../../pages/ProfilePage';
import { GameTestService } from '../../helpers/GameTestService';

// Define the types for our custom fixtures
type MyFixtures = {
  loginPage: LoginPage;
  gamePage: GamePage;
  profilePage: ProfilePage;
  gameTestService: GameTestService;
  randomUsername: string;
};

// Extend the base test to include our POMs
export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  gamePage: async ({ page }, use) => {
    await use(new GamePage(page));
  },
  profilePage: async ({ page }, use) => {
    await use(new ProfilePage(page));
  },
  gameTestService: async ({ page }, use) => {
    const gamePage = new GamePage(page);
    await use(new GameTestService(page, gamePage));
  },
  randomUsername: async ({}, use) => {
    const timestamp = new Date().getTime();
    await use(`User_${timestamp}`);
  }
});

// Extend again for tests that require authentication
export const authenticatedTest = test.extend<MyFixtures & { autoAuth: void }>({
  autoAuth: [async ({ page, loginPage, randomUsername }, use) => {
    await loginPage.goto();

    await page.evaluate(() => {
      window.localStorage.clear();
      window.sessionStorage.clear();
    });
    await page.reload();

    // The app auto-logins upon creation
    await loginPage.createAccount(randomUsername);
    
    // Wait for the game UI to appear
    const gamePage = new GamePage(page);
    await expect(gamePage.difficultySelect).toBeVisible({ timeout: 5000 });
    
    await use();
  }, { auto: true }],
});
