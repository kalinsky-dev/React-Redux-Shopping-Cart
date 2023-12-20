import { configureStore } from '@reduxjs/toolkit';
import uiSlice from './ui-slice';

const store = confgitureStore({
  reducer: { ui: uiSlice.reducer },
});

export default store;
