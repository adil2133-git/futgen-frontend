import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/Axios';
import { useAuth } from './AuthProvider';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState([]);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist();
        } else {
            setWishlist([]);
        }
    }, [isAuthenticated]);  

    const fetchWishlist = async () => {
        try {
            const res = await api.get("/wishlist");
            setWishlist(res.data.data || []);
        } catch (err) {
            console.error("Fetch wishlist error:", err);
        }
    };

    const addToWishlist = async (productId) => {
  try {
    await api.post(`/wishlist/add/${productId}`);
    await fetchWishlist();
  } catch (err) {
    console.error("Add wishlist error:", err);
    throw err; // 🔥 THIS LINE IS CRITICAL
  }
};

    const removeFromWishlist = async (productId) => {
        try {
            await api.delete(`/wishlist/remove/${productId}`);
            await fetchWishlist();
        } catch (err) {
            console.error("Remove wishlist error:", err);
        }
    };

    const isInWishlist = (productId) => {
        if (!productId) return false;
        return wishlist?.some(item =>
            item._id?.toString() === productId?.toString()
        );
    };

    const clearWishlist = async () => {
        try {
            await api.delete("/wishlist/clear");
            setWishlist([]);
        } catch (err) {
            console.error("Clear wishlist error:", err);
        }
    };

    const getWishlistCount = () => wishlist?.length || 0;

    const value = {
        wishlist,
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