import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthProvider';
import {
  fetchWishlist as fetchWishlistThunk,
  addToWishlist as addToWishlistThunk,
  removeFromWishlist as removeFromWishlistThunk,
  clearWishlist as clearWishlistThunk,
  clearWishlistLocal
} from '../store/slices/wishlistSlice';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist.wishlist);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchWishlistThunk());
    } else {
      dispatch(clearWishlistLocal());
    }
  }, [isAuthenticated, dispatch]);

  const fetchWishlist = async () => {
    return dispatch(fetchWishlistThunk());
  };

  const addToWishlist = async (productId) => {
    try {
      await dispatch(addToWishlistThunk(productId)).unwrap();
    } catch (err) {
      console.error("Add wishlist error:", err);
      throw err;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await dispatch(removeFromWishlistThunk(productId)).unwrap();
    } catch (err) {
      console.error("Remove wishlist error:", err);
    }
  };

  const isInWishlist = (productId) => {
    if (!productId) return false;
    return wishlist?.some(item =>
      (item._id?.toString() === productId?.toString()) ||
      (item.id?.toString() === productId?.toString())
    );
  };

  const clearWishlist = async () => {
    try {
      await dispatch(clearWishlistThunk()).unwrap();
    } catch (err) {
      console.error("Clear wishlist error:", err);
    }
  };

  const getWishlistCount = () => wishlist?.length || 0;

  const value = {
    wishlist,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    getWishlistCount
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export default WishlistContext;