import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { GamePage } from '../pages/GamePage';

test.describe('Module 2 - Gameplay & Game Logic', () => {
  let loginPage: LoginPage;
  let gamePage: GamePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    gamePage = new GamePage(page);

    await loginPage.goto();
    const testUser = `Player_${Date.now()}`;
    await loginPage.createAccount(testUser);
    
    await expect(gamePage.cells.first()).toBeVisible({ timeout: 5000 });
  });

  test('TS-11: Human player should be able to make moves in all available cells', async ({ page }) => {
    for (let i = 0; i < 9; i++) {
      await gamePage.clickCell(i);
      await page.waitForTimeout(300); 

      const boardState = await gamePage.getBoardState();
      expect(boardState[i]).toContain('x');

      await gamePage.resetBoard();
      await page.waitForTimeout(300);
      
      const emptyBoardState = await gamePage.getBoardState();
      expect(emptyBoardState[i]).toBe('');
    }
  });

  test('TS-14: Should change difficulty setting to all available levels', async ({ page }) => {
    const difficulties = ['Easy', 'Medium', 'Hard'];

    for (const level of difficulties) {
      await gamePage.difficultySelect.selectOption({ label: level });
      await page.waitForTimeout(100);
      
      const selectedText = await gamePage.difficultySelect.locator('option:checked').textContent();
      expect(selectedText?.trim()).toBe(level);
    }
  });

  test('TS-15 [Defect Check]: Computer should not overwrite an occupied cell on Hard difficulty', async () => {
    const bugReports = await gamePage.checkNoCellOverwriteOnHard();

    if (bugReports.length > 0) {
      const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
      expect(bugReports.length, `\n🚨 BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
    }
  });

  test('TS-16 [Defect Check]: Hint should not highlight an already occupied cell', async () => {
    const bugReports = await gamePage.checkHintDoesNotHighlightOccupiedCells();

    if (bugReports.length > 0) {
      const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
      expect(bugReports.length, `\n🚨 HINT BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
    }
  });
});