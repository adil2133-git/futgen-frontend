import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/Axios';

export const fetchWishlist = createAsyncThunk(
  'wishlist/fetchWishlist',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/wishlist');
      return res.data.data || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch wishlist');
    }
  }
);

export const addToWishlist = createAsyncThunk(
  'wishlist/addToWishlist',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/wishlist/add/${productId}`);
      await dispatch(fetchWishlist());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item to wishlist');
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  'wishlist/removeFromWishlist',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      await dispatch(fetchWishlist());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item from wishlist');
    }
  }
);

export const clearWishlist = createAsyncThunk(
  'wishlist/clearWishlist',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/wishlist/clear');
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear wishlist');
    }
  }
);

const initialState = {
  wishlist: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishlist: (state, action) => {
      state.wishlist = action.payload;
    },
    clearWishlistLocal: (state) => {
      state.wishlist = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchWishlist
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.wishlist = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // clearWishlist
      .addCase(clearWishlist.fulfilled, (state) => {
        state.wishlist = [];
        state.loading = false;
      });
  },
});

export const { setWishlist, clearWishlistLocal } = wishlistSlice.actions;
export default wishlistSlice.reducer;
