import { createSlice } from '@reduxjs/toolkit';

const asteroidSlice = createSlice({
  name: 'asteroid',
  initialState: {
    asteroidId: '',
    asteroidData: null,
    error: null,
    loading: false,
    imageUrl: '',
    recentSearches: [],
    asteroidImageData: null
  },
  reducers: {
    setAsteroidId: (state, action) => {
      state.asteroidId = action.payload;
    },
    setAsteroidData: (state, action) => {
      state.asteroidData = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setImageUrl: (state, action) => {
      state.imageUrl = action.payload;
    },
    addRecentSearch: (state, action) => {
      state.recentSearches = [...new Set([action.payload, ...state.recentSearches.slice(0, 4)])];
    },
    setAsteroidImageData: (state, action) => {
      state.asteroidImageData = action.payload;
    }
  }
});

export const {
  setAsteroidId,
  setAsteroidData,
  setError,
  setLoading,
  setImageUrl,
  addRecentSearch,
  setAsteroidImageData
} = asteroidSlice.actions;

export default asteroidSlice.reducer;
