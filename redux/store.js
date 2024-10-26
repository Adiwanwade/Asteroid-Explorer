import { configureStore } from '@reduxjs/toolkit';
import asteroidReducer from './asteroidSlice';

export const store = configureStore({
  reducer: {
    asteroid: asteroidReducer
  }
});