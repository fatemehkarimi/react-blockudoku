import { createSlice } from "@reduxjs/toolkit";
import { EMPTY, FILLABLE, FILL } from "../../constants";
import appConfig from '../../config/config.json';

const boardSize = appConfig["game"]["unit-board-size"] ** 2;

function initBoard() {
  return Array(boardSize).fill(
          Array(boardSize).fill(EMPTY));
}

const initialState = {
  score: 0,
  board: initBoard(),
  boardView: initBoard()
}

const scoreSlice = createSlice({
  name: 'score',
  initialState: initialState,
  reducers: {
    resetGame: (state, action) => {
      state.score = initialState.score;
      state.board = initBoard();
      state.boardView = initBoard();
    },
    setBoardView: (state, action) => {
      for(var i = 0; i < state.boardView.length; i++)
        state.boardView[i] = action.payload.newBoard[i].slice();
    },
    setBoard: (state, action) => {
      for(var i = 0; i < state.board.length; i++)
        state.board[i] = action.payload.newBoard[i].slice();
    },
    fillBoardWithShape: (state, action) => {
      const { row, column, matrix: shape } = action.payload.shape;
      var board = state.board;
      if(action.payload.board == 'view')
        board = state.boardView;

      for(var i = 0; i < row; ++i)
        for(var j = 0; j < column; ++j)
          if(shape[i][j] == FILL) {
            var idx_i = action.payload.i + i;
            var idx_j = action.payload.j + j;
            board[idx_i][idx_j] = action.payload.status;
          }
    },
    setScore: (state, action) => {
      state.score = action.payload.score;
    },
    addScore: (state, action) => {
      state.score += action.payload.score;
    }
  }
});

export const { 
  calcUserScore,
  resetGame,
  setBoardView,
  setBoard,
  fillBoardWithShape,
  setScore, addScore } = scoreSlice.actions;
export default scoreSlice.reducer;