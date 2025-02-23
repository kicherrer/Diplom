import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../api/client';

interface AdminState {
  analytics: {
    userStats: any;
    contentStats: any;
    loading: boolean;
    error: string | null;
  };
  users: {
    list: any[];
    loading: boolean;
    error: string | null;
  };
}

const initialState: AdminState = {
  analytics: {
    userStats: null,
    contentStats: null,
    loading: false,
    error: null,
  },
  users: {
    list: [],
    loading: false,
    error: null,
  },
};

export const fetchAnalytics = createAsyncThunk(
  'admin/fetchAnalytics',
  async () => {
    const response = await api.admin.getAnalytics();
    return response.data;
  }
);

export const fetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async () => {
    const response = await api.admin.getUsers();
    return response.data;
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalytics.pending, (state) => {
        state.analytics.loading = true;
      })
      .addCase(fetchAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.userStats = action.payload.userStats;
        state.analytics.contentStats = action.payload.contentStats;
      })
      .addCase(fetchAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error = action.error.message || null;
      })
      .addCase(fetchUsers.pending, (state) => {
        state.users.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.users.loading = false;
        state.users.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.users.loading = false;
        state.users.error = action.error.message || null;
      });
  },
});

export default adminSlice.reducer;
