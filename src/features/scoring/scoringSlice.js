import { createSlice } from "@reduxjs/toolkit";
import { EMPTY, FILLABLE, FILL } from "../../constants";
import appConfig from '../../config/config.json';

const boardSize = appConfig["game"]["unit-board-size"] ** 2;

function initBoard() {
  return Array(boardSize).fill(
          Array(boardSize).fill(EMPTY));
}

function isFillableOnBoard(board, board_i, board_j, shapeDetails) {
  const { row, column, matrix: shape } = shapeDetails;
  var canBeFilled = true;
  for(var i = 0; i < row; ++i)
    for(var j = 0; j < column; ++j)
      if(shape[i][j] == FILL) {
          var tmp_i = board_i + i;
          var tmp_j = board_j + j;

          if(tmp_i >= 0 && tmp_i < boardSize
            && tmp_j >= 0 && tmp_j < boardSize) {
            if(board[tmp_i][tmp_j] == FILL)
              canBeFilled = false;
          }
          else
            canBeFilled = false;

          if(!canBeFilled)
            break;
      }
  return canBeFilled;
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
    calcUserScore: (state, action) => {
    },
    resetGame: (state, action) => {
      state.score = initialState.score;
      state.board = initBoard();
      state.boardView = initBoard();
    },
    setBoardView: (state, action) => {
      for(var i = 0; i < state.boardView.length; i++)
        state.boardView[i] = action.payload.newBoard[i].slice();
    },
    fillBoard: (state, action) => {
      const { row, column, matrix: shape } = action.payload.shape;
      var board = state.board;
      if(action.payload.board == 'view')
        board = state.boardView;

      if(isFillableOnBoard(
        state.board,
        action.payload.i,
        action.payload.j,
        action.payload.shape))
        {
          for(var i = 0; i < row; ++i)
            for(var j = 0; j < column; ++j)
              if(shape[i][j] == FILL) {
                var idx_i = action.payload.i + i;
                var idx_j = action.payload.j + j;
                board[idx_i][idx_j] = action.payload.status;
              }
        }
    },
  }
});

export const { 
  calcUserScore,
  resetGame,
  setBoardView,
  fillBoard } = scoreSlice.actions;
export default scoreSlice.reducer;