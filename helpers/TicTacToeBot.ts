

export class TicTacToeBot {
  private static readonly winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  /**
   * Calculates the optimal next move for a given player using Minimax.
   * player: 'x' or 'o'
   */
  static getOptimalMove(boardState: string[], player: 'x' | 'o'): number {
    let bestScore = -Infinity;
    let bestMove = -1;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = player;
        let score = this.minimax(boardState, 0, false, player);
        boardState[i] = '';
        // Add a small random factor to tie-break equal scores for variety
        if (score > bestScore || (score === bestScore && Math.random() > 0.5)) {
          bestScore = score;
          bestMove = i;
        }
      }
    }
    return bestMove;
  }

  /**
   * Calculates the WORST next move for a given player using Minimax (to force a loss).
   */
  static getWorstMove(boardState: string[], player: 'x' | 'o'): number {
    let worstScore = Infinity;
    let worstMove = -1;
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = player;
        let score = this.minimax(boardState, 0, false, player);
        boardState[i] = '';
        if (score < worstScore) {
          worstScore = score;
          worstMove = i;
        }
      }
    }
    return worstMove;
  }

  /**
   * Calculates a move intended to force a DRAW (blocks opponent, avoids winning).
   */
  static getDrawMove(boardState: string[], player: 'x' | 'o'): number {
    const opponent = player === 'x' ? 'o' : 'x';
    
    // 1. Must block opponent if they are about to win
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = opponent;
        const wouldLose = this.getGameStatus(boardState) === opponent;
        boardState[i] = '';
        if (wouldLose) return i;
      }
    }
    
    // 2. Pick a move that does NOT win for us
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        boardState[i] = player;
        const wouldWin = this.getGameStatus(boardState) === player;
        boardState[i] = '';
        if (!wouldWin) return i;
      }
    }
    
    // 3. Fallback to any empty cell
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') return i;
    }
    
    return -1;
  }

  private static minimax(boardState: string[], depth: number, isMaximizing: boolean, aiPlayer: 'x' | 'o'): number {
    const status = this.getGameStatus(boardState);
    if (status === aiPlayer) return 10 - depth;
    if (status !== null && status !== 'draw') return depth - 10;
    if (status === 'draw') return 0;

    const opponent = aiPlayer === 'x' ? 'o' : 'x';

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
          boardState[i] = aiPlayer;
          let score = this.minimax(boardState, depth + 1, false, aiPlayer);
          boardState[i] = '';
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < 9; i++) {
        if (boardState[i] === '') {
          boardState[i] = opponent;
          let score = this.minimax(boardState, depth + 1, true, aiPlayer);
          boardState[i] = '';
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  }

  /**
   * Checks if there is a winner or draw on the board.
   * Returns 'x', 'o', 'draw', or null if the game is ongoing.
   */
  static getGameStatus(boardState: string[]): 'x' | 'o' | 'draw' | null {
    for (const [a, b, c] of this.winLines) {
      if (
        boardState[a] !== '' && 
        boardState[a] === boardState[b] && 
        boardState[b] === boardState[c]
      ) {
        return boardState[a] as 'x' | 'o';
      }
    }

    if (!boardState.includes('')) {
      return 'draw';
    }

    return null;
  }
}