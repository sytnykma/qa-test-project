import { expect } from '@playwright/test';
import { authenticatedTest as test } from './fixtures/baseTest';

test.describe('Module 2 - Gameplay & Game Logic', () => {

  test('GAME-01: Gameplay – Human Victory', async ({ gamePage, gameTestService }) => {
    let result = null;
    for (let i = 0; i < 5; i++) {
      result = await gameTestService.playGameDynamically('Easy', 'optimal');
      if (result === 'x') break;
    }
    expect(result).toBe('x');
    await expect(gamePage.status).toContainText(/win/i, { ignoreCase: true });
  });

  test('GAME-02: Gameplay – Computer Player Victory', async ({ gamePage, gameTestService }) => {
    const result = await gameTestService.playGameDynamically('Hard', 'worst');
    expect(result).toBe('o');
    await expect(gamePage.status).toContainText(/lose|computer/i, { ignoreCase: true });
  });

  test('GAME-03: Gameplay – Draw Condition', async ({ gamePage, gameTestService }) => {
    await gameTestService.forceDraw();
    await expect(gamePage.status).toContainText(/draw|tie/i, { ignoreCase: true });
  });

  test('GAME-04: Game Settings – Difficulty Selection', async ({ page, gamePage }) => {
    const difficulties = ['Easy', 'Medium', 'Hard'];

    for (const level of difficulties) {
      await gamePage.difficultySelect.selectOption({ label: level });
      await expect(gamePage.difficultySelect).toHaveValue(level.toLowerCase());
    }
  });

  test('GAME-05: Game Logic – Move Validation & Occupied Cells (BUG-01)', async ({ gameTestService }) => {
    test.setTimeout(60000);
    const bugReports = await gameTestService.checkNoCellOverwriteOnHard();

    if (bugReports.length > 0) {
      const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
      expect(bugReports.length, `\n🚨 BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
    }
  });

  test('GAME-06: Game Logic – Hint System Validation (BUG-02)', async ({ gameTestService }) => {
    test.setTimeout(60000);
    const bugReports = await gameTestService.checkHintDoesNotHighlightOccupiedCells();

    if (bugReports.length > 0) {
      const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
      expect(bugReports.length, `\n🚨 HINT BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
    }
  });

  test('GAME-07: Session Management – Logout Functionality', async ({ page, loginPage }) => {
    const logoutBtn = page.getByRole('button', { name: /Log Out|خروج/i });
    await logoutBtn.click();
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('GAME-08: Board Interaction – Cell Clickability/Input Validation', async ({ page, gamePage }) => {
    for (let i = 0; i < 9; i++) {
      await gamePage.clickCell(i);
      await gamePage.waitForCellText(i, 'x'); 

      const boardState = await gamePage.getBoardState();
      expect(boardState[i]).toContain('x');

      await gamePage.resetBoard();
      await expect(gamePage.cells.nth(i)).toHaveText('', { timeout: 3000 });
      
      const emptyBoardState = await gamePage.getBoardState();
      expect(emptyBoardState[i]).toBe('');
    }
  });

  test('GAME-09: Game State – Board Freeze After Game Over', async ({ gamePage }) => {
    // Play a safe winning sequence that avoids computer overwrite bugs
    await gamePage.difficultySelect.selectOption({ label: 'Easy' });
    
    // Mock random so computer doesn't randomly block our winning cells
    await gamePage.page.evaluate(() => {
        const values = [0, 0, 0];
        let i = 0;
        Math.random = () => i < values.length ? values[i++] : 0;
    });
    
    await gamePage.clickCell(6);
    await gamePage.waitForCellText(6, 'x');
    await gamePage.page.waitForTimeout(500); // let comp play
    
    await gamePage.clickCell(7);
    await gamePage.waitForCellText(7, 'x');
    await gamePage.page.waitForTimeout(500); // let comp play
    
    await gamePage.clickCell(8);
    await gamePage.waitForCellText(8, 'x');
    
    // Now human won! (6,7,8)
    await expect(gamePage.status).toContainText(/win/i);
    
    const boardState = await gamePage.getBoardState();
    const emptyIndex = boardState.findIndex(cell => cell === '');
    
    if (emptyIndex !== -1) {
      await expect(gamePage.cells.nth(emptyIndex)).toBeDisabled();
    }
  });

  test('GAME-10: Game State – Mid-game Reset Functionality & History Isolation', async ({ page, gamePage }) => {
    await gamePage.clickCell(0);
    await expect(gamePage.cells.nth(0)).toHaveText(/x/i);
    await gamePage.resetBoard();
    await expect(gamePage.cells.nth(0)).toHaveText('');
    await expect(gamePage.status).not.toContainText(/win|lose|draw/i);
  });
});