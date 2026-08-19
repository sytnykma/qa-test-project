
import { Page, Locator, expect } from '@playwright/test';
import { TicTacToeBot } from '../helpers/TicTacToeBot';

export class GamePage {
  readonly page: Page;
  readonly cells: Locator;
  readonly difficultySelect: Locator;
  readonly hintButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cells = page.locator('.cell');
    this.difficultySelect = page.locator('select').last(); 
    this.hintButton = page.locator('button:has-text("Hint")');
    this.resetButton = page.locator('[data-testid="btn-reset"]');
  }

  async clickCell(index: number) {
    await this.cells.nth(index).click();
  }

  async requestHint() {
    await this.hintButton.click();
  }

  async resetBoard() {
    await this.resetButton.click();
  }

  async getBoardState(): Promise<string[]> {
    const state: string[] = [];
    const count = await this.cells.count();
    for (let i = 0; i < count; i++) {
      const text = await this.cells.nth(i).textContent();
      state.push(text ? text.trim().toLowerCase() : ''); 
    }
    return state;
  }

  /**
   * Encapsulated logic for TS-15: 
   * Runs 9 full games to check if computer overwrites human cells on Hard difficulty.
   */
  async checkNoCellOverwriteOnHard(): Promise<string[]> {
    const bugReports: string[] = [];

    for (let startCell = 0; startCell < 9; startCell++) {
      await this.resetBoard();
      await this.page.waitForTimeout(200); 
      await this.difficultySelect.selectOption({ label: 'Hard' });
      
      let moveHistory: string[] = [];
      let humanOccupiedCells: number[] = [];
      let bugDetectedInThisGame = false;
      
      for (let turn = 0; turn < 5; turn++) {
        let boardState = await this.getBoardState();
        if (TicTacToeBot.getGameStatus(boardState) !== null) break;

        const nextMove = (turn === 0) ? startCell : TicTacToeBot.getBestMove(boardState, startCell);
        if (nextMove === -1 || boardState[nextMove] !== '') break;

        await this.clickCell(nextMove);
        humanOccupiedCells.push(nextMove);
        moveHistory.push(`Human [${nextMove}]`);

        let postHumanBoardState = await this.getBoardState();
        if (TicTacToeBot.getGameStatus(postHumanBoardState) !== null) break;

        await this.page.waitForTimeout(500);
        const newBoardState = await this.getBoardState();

        for (let i = 0; i < 9; i++) {
          if (newBoardState[i].includes('o') && !postHumanBoardState[i].includes('o')) {
             moveHistory.push(`Computer [${i}]`);
          }
        }

        for (const cellIndex of humanOccupiedCells) {
          if (!newBoardState[cellIndex].includes('x')) {
            bugReports.push(
              `Game starting at cell [${startCell}]: Computer overwrote cell [${cellIndex}]\n` +
              `   Steps: ${moveHistory.join(' -> ')}`
            );
            bugDetectedInThisGame = true;
            break;
          }
        }

        if (bugDetectedInThisGame) break;
        if (TicTacToeBot.getGameStatus(newBoardState) !== null) break;
      }
    }
    return bugReports;
  }

  /**
   * Encapsulated logic for TS-16: 
   * Runs 9 full games to check if Hint highlights already occupied cells.
   */
  async checkHintDoesNotHighlightOccupiedCells(): Promise<string[]> {
    const bugReports: string[] = [];

    for (let startCell = 0; startCell < 9; startCell++) {
      await this.resetBoard();
      await this.page.waitForTimeout(200); 
      
      let moveHistory: string[] = [];
      let bugDetectedInThisGame = false;
      
      for (let turn = 0; turn < 5; turn++) {
        let boardState = await this.getBoardState();
        if (TicTacToeBot.getGameStatus(boardState) !== null) break;

        await this.requestHint();
        await this.page.waitForTimeout(300);

        let hintedCellIndex = -1;
        for (let i = 0; i < 9; i++) {
          const classList = await this.cells.nth(i).getAttribute('class');
          if (classList && classList.toLowerCase().includes('hint')) {
            hintedCellIndex = i;
            break;
          }
        }

        if (hintedCellIndex !== -1) {
          if (boardState[hintedCellIndex] !== '') {
            bugReports.push(
              `Game starting at cell [${startCell}], Turn ${turn + 1}:\n` +
              `   Hint highlighted occupied cell [${hintedCellIndex}] ('${boardState[hintedCellIndex]}')\n` +
              `   Steps: ${moveHistory.join(' -> ') || 'Start of game'}`
            );
            bugDetectedInThisGame = true;
            break;
          }
        }

        const nextMove = (turn === 0) ? startCell : TicTacToeBot.getBestMove(boardState, startCell);
        if (nextMove === -1 || boardState[nextMove] !== '') break;

        await this.clickCell(nextMove);
        moveHistory.push(`Human [${nextMove}]`);

        let postHumanBoardState = await this.getBoardState();
        if (TicTacToeBot.getGameStatus(postHumanBoardState) !== null) break;

        await this.page.waitForTimeout(500);
        const newBoardState = await this.getBoardState();
        
        for (let i = 0; i < 9; i++) {
          if (newBoardState[i].includes('o') && !postHumanBoardState[i].includes('o')) {
             moveHistory.push(`Computer [${i}]`);
          }
        }

        if (TicTacToeBot.getGameStatus(newBoardState) !== null) break;
      }
    }
    return bugReports;
  }
}