import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/Axios';

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/users/getUser');
      return res.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Authentication failed');
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post('/users/login', { email, password });
      const userData = res.data.user;
      await dispatch(checkAuthStatus());
      return {
        user: userData,
        isAdmin: userData?.role === 'admin'
      };
    } catch (err) {
      if (err.response?.status === 403) {
        return rejectWithValue({ message: 'Your account has been blocked by admin', status: 403 });
      }
      const message = err.response?.data?.message || 'Login failed';
      return rejectWithValue({ message, status: err.response?.status });
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await api.post('/users/register', userData);
      return res.data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Registration failed');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/users/logout');
      return null;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Logout failed');
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setIsAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    updateUser: (state, action) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // checkAuthStatus
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
      })
      // loginUser
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Login failed';
      })
      // registerUser
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      // logoutUser
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = null;
      });
  },
});

export const { setUser, setIsAuthenticated, setLoading, setError, clearError, updateUser } = authSlice.actions;
export default authSlice.reducer;
