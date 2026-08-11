import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/Axios';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/cart');
      return res.data.data?.products || [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, size }, { dispatch, rejectWithValue }) => {
    try {
      await api.post(`/cart/add/${productId}`, { size });
      await dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to add item to cart');
    }
  }
);

export const increaseQuantity = createAsyncThunk(
  'cart/increaseQuantity',
  async ({ productId, size }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/cart/increase/${productId}`, { size });
      await dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to increase quantity');
    }
  }
);

export const decreaseQuantity = createAsyncThunk(
  'cart/decreaseQuantity',
  async ({ productId, size }, { dispatch, rejectWithValue }) => {
    try {
      await api.patch(`/cart/decrease/${productId}`, { size });
      await dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to decrease quantity');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async ({ productId, size }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/cart/remove/${productId}`, { data: { size } });
      await dispatch(fetchCart());
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to remove item from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await api.delete('/cart/clear');
      return [];
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || 'Failed to clear cart');
    }
  }
);

const initialState = {
  cart: [],
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    clearCartLocal: (state) => {
      state.cart = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchCart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.cart = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // clearCart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = [];
        state.loading = false;
      });
  },
});

export const parsePrice = (priceString) => {
  if (!priceString) return 0;
  const price = priceString
    .toString()
    .replace(/Rs\.|₹|,/g, '')
    .replace(/\s+/g, '')
    .trim();
  return parseFloat(price) || 0;
};

export const { setCart, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;
