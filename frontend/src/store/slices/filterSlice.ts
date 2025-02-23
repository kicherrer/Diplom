import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FilterState {
  genres: string[];
  rating: [number, number];
  year: number;
  searchQuery: string;
  sortBy: 'rating' | 'release_date' | 'title';
  sortOrder: 'asc' | 'desc';
}

const initialState: FilterState = {
  genres: [],
  rating: [0, 10],
  year: new Date().getFullYear(),
  searchQuery: '',
  sortBy: 'rating',
  sortOrder: 'desc'
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setGenres: (state, action: PayloadAction<string[]>) => {
      state.genres = action.payload;
    },
    setRating: (state, action: PayloadAction<[number, number]>) => {
      state.rating = action.payload;
    },
    setYear: (state, action: PayloadAction<number>) => {
      state.year = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setSortBy: (state, action: PayloadAction<FilterState['sortBy']>) => {
      state.sortBy = action.payload;
    },
    setSortOrder: (state, action: PayloadAction<FilterState['sortOrder']>) => {
      state.sortOrder = action.payload;
    },
    resetFilters: () => initialState
  }
});

export const {
  setGenres,
  setRating,
  setYear,
  setSearchQuery,
  setSortBy,
  setSortOrder,
  resetFilters
} = filterSlice.actions;

export default filterSlice.reducer;
