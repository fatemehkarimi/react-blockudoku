import { configureStore } from '@reduxjs/toolkit';
import scoringReducer from '../features/scoring/scoringSlice';

const store = configureStore({
  reducer: {
    score: scoringReducer
  },
})

export default store;