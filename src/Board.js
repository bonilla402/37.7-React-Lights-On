import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

/**
 * The Board component generates a game board with a specified number of rows and columns.
 * Each cell in the board has a chance to start as "lit" based on the `chanceLightStartsOn` value.
 *
 * @param {number} nrows - Number of rows in the board.
 * @param {number} ncols - Number of columns in the board.
 * @param {number} chanceLightStartsOn - Chance that any cell is lit at the start of the game.
 */
function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.40 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  /**
   * Creates the initial game board with each cell set to true (lit) or false (unlit).
   * The state of each cell is determined randomly based on the `chanceLightStartsOn` value.
   *
   * @returns {boolean[][]} A 2D array representing the game board, where each cell is either true (lit) or false (unlit).
   */
  function createBoard() {
    let initialBoard = [];

    for (let i = 0; i < nrows; i++) {
      let row = [];
      for (let j = 0; j < ncols; j++) {
        row.push(Math.random() < chanceLightStartsOn);
      }
      initialBoard.push(row);
    }

    return initialBoard;
  }
  
  /**
   * Checks if the player has won the game by verifying that all lights are on.
   *
   * @returns {boolean} - Returns true if all cells in the board are true (lit), otherwise false.
   */
  function hasWon() {
    for (let row of board) {
      for (let cell of row) {
        if (!cell) return false;
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = oldBoard.map(row => [...row]);

      //In the copy, flip this cell and the cells around it
      flipCell(y, x, boardCopy);             // Flip the clicked cell
      flipCell(y, x - 1, boardCopy);      // Flip the cell to the left
      flipCell(y, x + 1, boardCopy);      // Flip the cell to the right
      flipCell(y - 1, x, boardCopy);      // Flip the cell above
      flipCell(y + 1, x, boardCopy);      // Flip the cell below

      return boardCopy;
    });
  }

  const gameWon = hasWon();

  // If the game is won, just show a winning message and render nothing else
  if (gameWon) {
    return <p>You won!</p>;
  }

  // make table board
  return (
      <div className="Board">
        <table>
          <tbody>
          {board.map((row, rowIdx) =>
              <tr key={rowIdx}>
                {row.map((isLit, colIdx) =>
                    <Cell
                        key={`${rowIdx}-${colIdx}`}
                        isLit={isLit}
                        flipCellsAroundMe={() => flipCellsAround(`${rowIdx}-${colIdx}`)}
                    />
                )}
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
}

export default Board;
