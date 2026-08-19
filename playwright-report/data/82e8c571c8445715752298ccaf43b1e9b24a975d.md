# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: game.spec.ts >> Module 2 - Gameplay & Game Logic >> TS-15 [Defect Check]: Computer should not overwrite an occupied cell on Hard difficulty
- Location: tests/game.spec.ts:48:7

# Error details

```
Error: 
🚨 BUGS IN 2 OF 9 GAMES!

#1: Game starting at cell [1]: Computer overwrote cell [1]
   Steps: Human [1] -> Computer [1]

#2: Game starting at cell [5]: Computer overwrote cell [5]
   Steps: Human [5] -> Computer [1] -> Human [6] -> Computer [0] -> Human [2] -> Computer [5]


expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 2
```

# Page snapshot

```yaml
- generic [ref=e2]:
  - banner [ref=e3]:
    - generic [ref=e4]:
      - heading "Tic-Tac-Toe" [level=1] [ref=e5]
      - paragraph [ref=e6]: A small game for test automation
    - generic [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]: Language
        - combobox "Language" [ref=e10]:
          - option "English" [selected]
          - option "Persian"
      - 'button "Theme: Dark" [ref=e11] [cursor=pointer]': Dark
  - main [ref=e12]:
    - navigation [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]: P
        - generic [ref=e16]: Hello, Player_1787163434365
      - generic [ref=e17]:
        - button "Play" [ref=e18] [cursor=pointer]
        - button "Profile" [ref=e19] [cursor=pointer]
        - button "History" [ref=e20] [cursor=pointer]
        - button "Log Out" [ref=e21] [cursor=pointer]
    - generic [ref=e22]:
      - generic [ref=e24]:
        - generic [ref=e25]: Difficulty
        - combobox "Difficulty" [ref=e26]:
          - option "Easy"
          - option "Medium"
          - option "Hard" [selected]
      - status [ref=e27]: You win!
      - grid "Tic-Tac-Toe board" [ref=e28]:
        - gridcell "row 1, column 1, X" [disabled] [ref=e29]: X
        - gridcell "row 1, column 2, O" [disabled] [ref=e30]: O
        - gridcell "row 1, column 3, empty" [disabled] [ref=e31]
        - gridcell "row 2, column 1, O" [disabled] [ref=e32]: O
        - gridcell "row 2, column 2, X" [disabled] [ref=e33]: X
        - gridcell "row 2, column 3, empty" [disabled] [ref=e34]
        - gridcell "row 3, column 1, empty" [disabled] [ref=e35]
        - gridcell "row 3, column 2, empty" [disabled] [ref=e36]
        - gridcell "row 3, column 3, X" [disabled] [ref=e37]: X
      - generic [ref=e38]:
        - button "New Game" [ref=e39] [cursor=pointer]
        - button "Get Hint" [disabled] [ref=e40]
        - button "Reset" [ref=e41] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import { LoginPage } from '../pages/LoginPage';
  3  | import { GamePage } from '../pages/GamePage';
  4  | 
  5  | test.describe('Module 2 - Gameplay & Game Logic', () => {
  6  |   let loginPage: LoginPage;
  7  |   let gamePage: GamePage;
  8  | 
  9  |   test.beforeEach(async ({ page }) => {
  10 |     loginPage = new LoginPage(page);
  11 |     gamePage = new GamePage(page);
  12 | 
  13 |     await loginPage.goto();
  14 |     const testUser = `Player_${Date.now()}`;
  15 |     await loginPage.createAccount(testUser);
  16 |     
  17 |     await expect(gamePage.cells.first()).toBeVisible({ timeout: 5000 });
  18 |   });
  19 | 
  20 |   test('TS-11: Human player should be able to make moves in all available cells', async ({ page }) => {
  21 |     for (let i = 0; i < 9; i++) {
  22 |       await gamePage.clickCell(i);
  23 |       await page.waitForTimeout(300); 
  24 | 
  25 |       const boardState = await gamePage.getBoardState();
  26 |       expect(boardState[i]).toContain('x');
  27 | 
  28 |       await gamePage.resetBoard();
  29 |       await page.waitForTimeout(300);
  30 |       
  31 |       const emptyBoardState = await gamePage.getBoardState();
  32 |       expect(emptyBoardState[i]).toBe('');
  33 |     }
  34 |   });
  35 | 
  36 |   test('TS-14: Should change difficulty setting to all available levels', async ({ page }) => {
  37 |     const difficulties = ['Easy', 'Medium', 'Hard'];
  38 | 
  39 |     for (const level of difficulties) {
  40 |       await gamePage.difficultySelect.selectOption({ label: level });
  41 |       await page.waitForTimeout(100);
  42 |       
  43 |       const selectedText = await gamePage.difficultySelect.locator('option:checked').textContent();
  44 |       expect(selectedText?.trim()).toBe(level);
  45 |     }
  46 |   });
  47 | 
  48 |   test('TS-15 [Defect Check]: Computer should not overwrite an occupied cell on Hard difficulty', async () => {
  49 |     const bugReports = await gamePage.checkNoCellOverwriteOnHard();
  50 | 
  51 |     if (bugReports.length > 0) {
  52 |       const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
> 53 |       expect(bugReports.length, `\n🚨 BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
     |                                                                                                  ^ Error: 
  54 |     }
  55 |   });
  56 | 
  57 |   test('TS-16 [Defect Check]: Hint should not highlight an already occupied cell', async () => {
  58 |     const bugReports = await gamePage.checkHintDoesNotHighlightOccupiedCells();
  59 | 
  60 |     if (bugReports.length > 0) {
  61 |       const summary = bugReports.map((rep, idx) => `#${idx + 1}: ${rep}`).join('\n\n');
  62 |       expect(bugReports.length, `\n🚨 HINT BUGS IN ${bugReports.length} OF 9 GAMES!\n\n${summary}\n`).toBe(0);
  63 |     }
  64 |   });
  65 | });
```