import React, { createContext, useContext, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from './AuthProvider';
import {
  fetchCart as fetchCartThunk,
  addToCart as addToCartThunk,
  increaseQuantity as increaseQuantityThunk,
  decreaseQuantity as decreaseQuantityThunk,
  removeFromCart as removeFromCartThunk,
  clearCart as clearCartThunk,
  clearCartLocal,
  parsePrice
} from '../store/slices/cartSlice';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartThunk());
    } else {
      dispatch(clearCartLocal());
    }
  }, [isAuthenticated, dispatch]);

  const fetchCart = async () => {
    return dispatch(fetchCartThunk());
  };

  const addToCart = async (productId, size) => {
    return dispatch(addToCartThunk({ productId, size }));
  };

  const increaseQuantity = async (productId, size) => {
    return dispatch(increaseQuantityThunk({ productId, size }));
  };

  const decreaseQuantity = async (productId, size) => {
    return dispatch(decreaseQuantityThunk({ productId, size }));
  };

  const removeFromCart = async (productId, size) => {
    return dispatch(removeFromCartThunk({ productId, size }));
  };

  const clearCart = async () => {
    return dispatch(clearCartThunk());
  };

  const getCartTotal = () => {
    return (cart || []).reduce((total, item) => {
      const price = parsePrice(item.productId?.price || item.price);
      return total + price * item.quantity;
    }, 0);
  };

  const getSubTotal = () => {
    return getCartTotal();
  };

  const getItemTotal = (item) => {
    const price = parsePrice(item.productId?.price || item.price);
    return price * item.quantity;
  };

  const getCartItemCount = () => {
    return (cart || []).reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId, size) => {
    return (cart || []).some(item => {
      const itemId = item.productId?._id || item.productId?.id || item.productId;
      const matchId = itemId?.toString() === productId?.toString();
      if (!size) return matchId;
      return matchId && item.size === size;
    });
  };

  const value = {
    cart,
    fetchCart,
    addToCart,
    removeFromCart,
    getCartTotal,
    getSubTotal,
    getItemTotal,
    getCartItemCount,
    isInCart,
    parsePrice,
    increaseQuantity,
    decreaseQuantity,
    clearCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;