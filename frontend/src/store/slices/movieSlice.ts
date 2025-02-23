import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';
import { Movie } from '../../types';

interface MovieState {
  movies: Movie[];
  loading: boolean;
  error: string | null;
  selectedMovie: Movie | null;
}

const initialState: MovieState = {
  movies: [],
  loading: false,
  error: null,
  selectedMovie: null,
};

export const fetchMovies = createAsyncThunk(
  'movies/fetchAll',
  async () => {
    const response = await api.movies.list();
    return response.data;
  }
);

export const fetchMoviesByMood = createAsyncThunk(
  'movies/fetchByMood',
  async (mood: string) => {
    const response = await api.movies.byMood(mood);
    return response.data;
  }
);

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSelectedMovie: (state, action) => {
      state.selectedMovie = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      })
      .addCase(fetchMoviesByMood.fulfilled, (state, action) => {
        state.movies = action.payload;
      });
  },
});

export const { setSelectedMovie } = movieSlice.actions;
export default movieSlice.reducer;
