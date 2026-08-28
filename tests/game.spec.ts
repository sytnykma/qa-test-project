import { test, expect } from './fixtures';

test.describe('Module 2 - Gameplay & Game Logic', () => {

  test.beforeEach(async ({ loginPage, gamePage }) => {
    await loginPage.goto();
    const testUser = `Player_${Date.now()}`;
    await loginPage.createAccount(testUser);
    
    await expect(gamePage.cells.first()).toBeVisible({ timeout: 5000 });
  });

  test('GAME-08: Board Interaction – Cell Clickability/Input Validation', async ({ page, gamePage }) => {
    for (let i = 0; i < 9; i++) {
      await gamePage.clickCell(i);
      await gamePage.waitForCellText(i, 'x'); 

      const boardState = await gamePage.getBoardState();
      expect(boardState[i]).toContain('x');

      await gamePage.resetBoard();
      // Wait for board to be cleared
      await expect(gamePage.cells.nth(i)).toHaveText('', { timeout: 3000 });
      
      const emptyBoardState = await gamePage.getBoardState();
      expect(emptyBoardState[i]).toBe('');
    }
  });

  test('GAME-04: Game Settings – Difficulty Selection', async ({ page, gamePage }) => {
    const difficulties = ['Easy', 'Medium', 'Hard'];

    for (const level of difficulties) {
      await gamePage.difficultySelect.selectOption({ label: level });
      
      // Wait until the select actually has the value (or check the locator)
      await expect(gamePage.difficultySelect).toHaveValue(level.toLowerCase());
    }
  });

  test('GAME-05: Game Logic – Move Validation & Occupied Cells (Defect Check)', async ({ gameTestService }) => {
    const bugReports = await gameTestService.checkNoCellOverwriteOnHard();

    if (bugReports.length > 0) {
      const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
      expect(bugReports.length, `\n🚨 BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
    }
  });

  test('GAME-06: Game Logic – Hint System Validation (Defect Check)', async ({ gameTestService }) => {
    const bugReports = await gameTestService.checkHintDoesNotHighlightOccupiedCells();

    if (bugReports.length > 0) {
      const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
      expect(bugReports.length, `\n🚨 HINT BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
    }
  });
});