import { test as baseTest } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GamePage } from '../pages/GamePage';
import { GameTestService } from '../helpers/GameTestService';

type CustomFixtures = {
  loginPage: LoginPage;
  gamePage: GamePage;
  gameTestService: GameTestService;
};

export const test = baseTest.extend<CustomFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  gamePage: async ({ page }, use) => {
    const gamePage = new GamePage(page);
    await use(gamePage);
  },
  gameTestService: async ({ page, gamePage }, use) => {
    const gameTestService = new GameTestService(page, gamePage);
    await use(gameTestService);
  },
});

export { expect } from '@playwright/test';
