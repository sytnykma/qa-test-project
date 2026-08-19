

export class TicTacToeBot {
  private static readonly winLines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];

  /**
   * Calculates the best next move for the Human player ('x').
   * Uses startOffset to dynamically vary the move sequence across different starting games.
   */
  static getBestMove(boardState: string[], startOffset: number = 0): number {
    const findWinningCell = (mark: string) => {
      for (const [a, b, c] of this.winLines) {
        if (boardState[a] === mark && boardState[b] === mark && boardState[c] === '') return c;
        if (boardState[a] === mark && boardState[c] === mark && boardState[b] === '') return b;
        if (boardState[b] === mark && boardState[c] === mark && boardState[a] === '') return a;
      }
      return -1;
    };

    // Priority 1: Instant Win for Human ('x')
    let move = findWinningCell('x');
    if (move !== -1) return move;

    // Priority 2: Block Computer's instant win ('o')
    move = findWinningCell('o');
    if (move !== -1) return move;

    // Priority 3: Dynamic Search - scan empty cells starting sequentially from startOffset
    for (let i = 0; i < 9; i++) {
      const candidateIndex = (startOffset + i) % 9;
      if (boardState[candidateIndex] === '') {
        return candidateIndex;
      }
    }

    return -1; // No empty cells left
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