import { EMPTY, FILL } from "../constants";
import appConfig from '../config/config.json';

export class ScoreCalculator {
  constructor(gameBoard) {
    this.board = gameBoard;
    this.unitBoardSize = appConfig["game"]["unit-board-size"];
    this.colScore = appConfig["score"]["col-fill-score"];
    this.rowScore = appConfig["score"]["row-fill-score"];
    this.squareScore = appConfig["score"]["square-fill-score"];
  }

  isRowFilled(idx) {
    for(let i = 0; i < this.board[idx].length; ++i) 
      if(this.board[idx][i] != FILL)
        return false;
    return true;
  }

  isColFilled(idx) {
    for(let i = 0; i < this.board.length; ++i)
      if(this.board[i][idx] != FILL)
        return false;
    return true;
  }

  isSquareFilled(row, col) {
    for(let i = row; i < row + this.unitBoardSize; ++i)
      for(let j = col; j < col + this.unitBoardSize; ++j)
        if(this.board[i][j] != FILL)
          return false;
    return true;
  }

  getFilledRows() {
    const result = [];
    for(let i = 0; i < this.board.length; ++i)
      if(this.isRowFilled(i))
        result.push(i);
    return result;
  }

  getFilledCols() {
    const result = [];
    for(let i = 0; i < this.board[0].length; ++i)
      if(this.isColFilled(i))
        result.push(i);
    return result;
  }

  getFilledSquares() {
    const result = [];
    for(let i = 0; i < this.board.length; i += this.unitBoardSize)
      for(let j = 0; j < this.board[0].length; j += this.unitBoardSize) {
        if(this.isSquareFilled(i, j))
          result.push({row: i, col: j});
      }
    return result;
  }

  calcScore() {
    const filledRows = this.getFilledRows();
    const filledCols = this.getFilledCols();
    const filledSquares = this.getFilledSquares();
    return filledRows.length * this.rowScore
            + filledCols.length * this.colScore
            + filledSquares.length * this.squareScore;
  }

  getNewBoard() {
    const newBoard = this.createCopyFromBoard();
    const filledRows = this.getFilledRows();
    const filledCols = this.getFilledCols();
    const filledSquares = this.getFilledSquares();

    console.log("filledRows = ", filledRows);
    console.log("filledCols = ", filledCols);
    console.log("filledSQus = ", filledSquares);
    

    for(const idx of filledRows)
      this.clearRow(newBoard, idx);

    for(const idx of filledCols)
      this.clearCol(newBoard, idx);

    for(const square of filledSquares)
      this.clearSquare(newBoard, square);
    
    return newBoard;
  }

  createCopyFromBoard() {
    const newBoard = [];
    for(let i = 0; i < this.board.length; ++i)
      newBoard.push(this.board[i].slice());
    return newBoard;
  }

  clearRow(board, idx) {
    for(let i = 0; i < board[idx].length; ++i)
      board[idx][i] = EMPTY;
  }

  clearCol(board, idx) {
    for(let i = 0; i < board.length; ++i)
      board[i][idx] = EMPTY;
  }

  clearSquare(board, {row, col}) {
    for(let i = row; i < row + this.unitBoardSize; ++i)
      for(let j = col; j < col + this.unitBoardSize; ++j)
        board[i][j] = EMPTY;
  }
}