import { Page, expect } from '@playwright/test';
import { GamePage } from '../pages/GamePage';
import { TicTacToeBot } from './TicTacToeBot';

export class GameTestService {
  constructor(private page: Page, private gamePage: GamePage) {}

  /**
   * Runs 9 full games to check if the computer overwrites human cells on Hard difficulty.
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

        const nextMove = (turn === 0) ? startCell : TicTacToeBot.getOptimalMove(boardState, 'x');
        if (nextMove === -1 || boardState[nextMove] !== '') break;

        await this.gamePage.clickCell(nextMove);
        humanOccupiedCells.push(nextMove);
        moveHistory.push(`Human [${nextMove}]`);

        // Wait for cell to become 'x'
        await this.gamePage.waitForCellText(nextMove, 'x');

        let postHumanBoardState = await this.gamePage.getBoardState();
        if (TicTacToeBot.getGameStatus(postHumanBoardState) !== null) break;

        // Wait for computer move
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
   * Runs 9 full games to check if the Hint system highlights already occupied cells.
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

        const nextMove = (turn === 0) ? startCell : TicTacToeBot.getOptimalMove(boardState, 'x');
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
  async waitForComputerMove(previousState: string[]) {
    // We wait until the board state has a new 'o' or the game ends (status becomes not computer-thinking)
    await expect(async () => {
      const currentState = await this.gamePage.getBoardState();
      const hasNewO = currentState.some((cell, i) => cell === 'o' && previousState[i] !== 'o');
      const isGameOver = TicTacToeBot.getGameStatus(currentState) !== null;
      expect(hasNewO || isGameOver).toBeTruthy();
    }).toPass({ timeout: 2000 });
  }

  /**
   * Dynamically plays a game.
   */
  async playGameDynamically(difficulty: string, strategy: 'optimal' | 'worst' | 'draw'): Promise<'x' | 'o' | 'draw'> {
    await this.gamePage.difficultySelect.selectOption({ label: difficulty });
    await this.gamePage.resetBoard();
    
    for (let turn = 0; turn < 5; turn++) {
      const boardState = await this.gamePage.getBoardState();
      let move = -1;
      if (strategy === 'optimal') move = TicTacToeBot.getOptimalMove(boardState, 'x');
      else if (strategy === 'worst') move = TicTacToeBot.getWorstMove(boardState, 'x');
      else if (strategy === 'draw') move = TicTacToeBot.getDrawMove(boardState, 'x');
      
      if (move === -1) break;
      
      await this.gamePage.clickCell(move);
      await this.gamePage.waitForCellText(move, 'x');
      
      const postMoveState = await this.gamePage.getBoardState();
      let status = TicTacToeBot.getGameStatus(postMoveState);
      if (status !== null) return status;
      
      await this.waitForComputerMove(postMoveState);
      
      status = TicTacToeBot.getGameStatus(await this.gamePage.getBoardState());
      if (status !== null) return status;
    }
    return 'draw'; // Fallback
  }

  /**
   * Forces a deterministic draw against the 'Easy' bot by mocking Math.random
   * and playing a specific sequence of moves.
   */
  async forceDraw() {
    await this.gamePage.difficultySelect.selectOption({ label: 'Easy' });
    await this.gamePage.resetBoard();
    
    // Mock random so 'Easy' bot plays exactly where we want
    await this.gamePage.page.evaluate(() => {
        const values = [0, 0.2, 0, 0];
        let i = 0;
        Math.random = () => i < values.length ? values[i++] : 0;
    });

    const play = async (cell: number) => {
        await this.gamePage.clickCell(cell);
        await this.gamePage.waitForCellText(cell, 'x');
        await this.gamePage.page.waitForTimeout(500); // Wait for bot to reply
    };

    // The forced sequence
    await play(1);
    await play(2);
    await play(3);
    await play(7);
    await play(8);
  }
}
