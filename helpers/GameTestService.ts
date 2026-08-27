import { Page, expect } from '@playwright/test';
import { GamePage } from '../pages/GamePage';
import { TicTacToeBot } from './TicTacToeBot';

export class GameTestService {
  constructor(private page: Page, private gamePage: GamePage) {}

  /**
   * Encapsulated logic for TS-15:
   * Runs 9 full games to check if computer overwrites human cells on Hard difficulty.
   */
  async checkNoCellOverwriteOnHard(): Promise<string[]> {
    const bugReports: string[] = [];

    for (let startCell = 0; startCell < 9; startCell++) {
      await this.gamePage.resetBoard();
      await this.gamePage.difficultySelect.selectOption({ label: 'Hard' });
      
      let moveHistory: string[] = [];
      let humanOccupiedCells: number[] = [];
      let bugDetectedInThisGame = false;
      
      for (let turn = 0; turn < 5; turn++) {
        let boardState = await this.gamePage.getBoardState();
        if (TicTacToeBot.getGameStatus(boardState) !== null) break;

        const nextMove = (turn === 0) ? startCell : TicTacToeBot.getBestMove(boardState, startCell);
        if (nextMove === -1 || boardState[nextMove] !== '') break;

        await this.gamePage.clickCell(nextMove);
        humanOccupiedCells.push(nextMove);
        moveHistory.push(`Human [${nextMove}]`);

        // Wait for cell to become 'x'
        await this.gamePage.waitForCellText(nextMove, 'x');

        let postHumanBoardState = await this.gamePage.getBoardState();
        if (TicTacToeBot.getGameStatus(postHumanBoardState) !== null) break;

        // Computer thinking wait (the app changes status or cell)
        // A better approach is to wait until a new 'o' appears or status changes to human/draw/win
        // The computer move can take up to 400ms (as simulated). Let's wait for any cell to turn 'o' that wasn't before
        await this.waitForComputerMove(postHumanBoardState);
        
        const newBoardState = await this.gamePage.getBoardState();
        
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
      await this.gamePage.resetBoard();
      
      let moveHistory: string[] = [];
      let bugDetectedInThisGame = false;
      
      for (let turn = 0; turn < 5; turn++) {
        let boardState = await this.gamePage.getBoardState();
        if (TicTacToeBot.getGameStatus(boardState) !== null) break;

        await this.gamePage.requestHint();
        // Wait for hint animation class to appear on some cell
        await expect(this.gamePage.cells.locator('.is-hint, .hint').first()).toBeVisible({ timeout: 1000 }).catch(() => {});
        
        let hintedCellIndex = -1;
        for (let i = 0; i < 9; i++) {
          const classList = await this.gamePage.cells.nth(i).getAttribute('class');
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

        await this.gamePage.clickCell(nextMove);
        moveHistory.push(`Human [${nextMove}]`);
        await this.gamePage.waitForCellText(nextMove, 'x');

        let postHumanBoardState = await this.gamePage.getBoardState();
        if (TicTacToeBot.getGameStatus(postHumanBoardState) !== null) break;

        await this.waitForComputerMove(postHumanBoardState);
        const newBoardState = await this.gamePage.getBoardState();
        
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

  /**
   * Helper to wait for the computer to make a move without using hard timeouts.
   */
  private async waitForComputerMove(previousState: string[]) {
    // We wait until the board state has a new 'o' or the game ends (status becomes not computer-thinking)
    await expect(async () => {
      const currentState = await this.gamePage.getBoardState();
      const hasNewO = currentState.some((cell, i) => cell === 'o' && previousState[i] !== 'o');
      const isGameOver = TicTacToeBot.getGameStatus(currentState) !== null;
      expect(hasNewO || isGameOver).toBeTruthy();
    }).toPass({ timeout: 2000 });
  }
}
