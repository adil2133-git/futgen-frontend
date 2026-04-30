import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import api from '../api/Axios';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user, isAuthenticated } = useAuth();

  const fetchCart = async () => {
    try {
      const res = await api.get("/cart")

      const products = res.data.data?.products || []
      
      setCart(products)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart()
    } else {
      setCart([]);
    }
  }, [isAuthenticated]);



  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    const price = priceString
      .toString()
      .replace(/Rs\.|₹|,/g, '')
      .replace(/\s+/g, '')
      .trim();
    return parseFloat(price) || 0;
  };

  const addToCart = async (productId, size) => {
    try {
      await api.post(`/cart/add/${productId}`, {size});
      await fetchCart()
    } catch (err) {
      console.log(err)
    }
  }


  const increaseQuantity = async (productId, size) => {
    try{
    await api.patch(`/cart/increase/${productId}`, {size})
    await fetchCart()
    }catch(err){
      console.log(err)
    }
  }


  const decreaseQuantity = async (productId, size) => {
    try{
    await api.patch(`/cart/decrease/${productId}`, {size})
    await fetchCart()
    }catch(err){
      console.log(err)
    }
  }


  const removeFromCart = async (productId, size) => {
    try {
      await api.delete(`/cart/remove/${productId}`, {data: {size}});
      await fetchCart()
    } catch (err) {
      console.log(err)
    }
  };


  const clearCart = async () => {
    try{
      await api.delete("/cart/clear");
      setCart([])
    }catch(err){
      console.log(err)
    }
  }


  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const price = parsePrice(item.productId.price);
      return total + price * item.quantity;
    }, 0);
  };

  const getSubTotal = () => {
    return getCartTotal();
  };

  const getItemTotal = (item) => {
    const price = parsePrice(item.productId.price);
    return price * item.quantity;
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId, size) => {
    return cart.some(item => item.productId._id === productId && item.size === size);
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