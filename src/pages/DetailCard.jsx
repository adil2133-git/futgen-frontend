import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/Axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartProvider';
import { useWishlist } from '../context/WishlistProvider';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'sonner';

function DetailCard() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('M');

  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const fetchProduct = async () => {
    const response = await api.get(`/products/${productId}`);
    setProduct(response.data);
  };

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const productIdValue = product?.id || product?._id;

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product?.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (productIdValue) {
      addToCart(productIdValue, selectedSize);
      toast.success('Product added to cart!');
    } else {
      console.log("Product id is missing");
      toast.error('Failed to add product to cart');
    }
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error('Please login to proceed with purchase');
      return;
    }

    if (product?.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    if (productIdValue) {
      addToCart(productIdValue, selectedSize);
      toast.success('Product added to cart! Redirecting...');
      navigate('/cart');
    }
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }

    if (!productIdValue) return;

    if (isInWishlist(productIdValue)) {
      removeFromWishlist(productIdValue);
      toast.success('Product removed from wishlist');
    } else {
      addToWishlist(productIdValue);
      toast.success('Product added to wishlist');
    }
  };

  const isProductInCart = isInCart(productIdValue, selectedSize);
  const isProductInWishlist = isInWishlist(productIdValue);
  const isOutOfStock = product?.stock === 0;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">

          {/* Image Section with Enhanced Styling */}
          <div className="lg:w-1/2">
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-xl overflow-hidden group">
              <div className="relative">
                <img
                  src={product?.image}
                  alt={product?.name}
                  className="w-full h-auto object-cover transform transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
                  }}
                />
                {isOutOfStock && (
                  <div className="absolute top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg">
                    Out of Stock
                  </div>
                )}
                {product?.stock > 0 && product?.stock < 10 && (
                  <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full font-semibold text-sm shadow-lg animate-pulse">
                    Limited Stock!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Details Section with Enhanced Styling */}
          <div className="lg:w-1/2 space-y-6">

            {/* Product Title & Category */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                {product?.name}
              </h1>

              <div className="flex items-baseline gap-3 flex-wrap">
                <p className="text-3xl font-bold text-gray-900">
                  {product?.price?.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR"
                  })}
                </p>
                {product?.originalPrice && (
                  <p className="text-lg text-gray-400 line-through">
                    {product?.originalPrice?.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR"
                    })}
                  </p>
                )}
              </div>

              {/* Stock Status with Enhanced Design */}
              <div className="mt-3 space-y-2">
                {isOutOfStock ? (
                  <div className="flex items-center gap-2 bg-red-50 border-l-4 border-red-600 px-4 py-2 rounded-md">
                    <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <p className="text-red-700 font-semibold">Out of Stock</p>
                  </div>
                ) : product?.stock > 0 && product?.stock < 10 ? (
                  <div className="flex items-center gap-2 bg-orange-50 border-l-4 border-orange-500 px-4 py-2 rounded-md">
                    <svg className="w-5 h-5 text-orange-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                    </svg>
                    <p className="text-orange-700 font-medium">
                      Only <span className="font-bold text-orange-800">{product.stock}</span> left! Hurry up!
                    </p>
                  </div>
                ) : product?.stock >= 10 && (
                  <div className="flex items-center gap-2 bg-green-50 border-l-4 border-green-500 px-4 py-2 rounded-md">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <p className="text-green-700 font-medium">In Stock</p>
                  </div>
                )}
              </div>

              {product?.category && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    {product.category}
                  </span>
                </div>
              )}
            </div>

            {/* Size Selection with Enhanced Design */}
            {!isOutOfStock && (
              <div className="space-y-3 border-t border-b border-gray-100 py-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                  Select Size:
                </h3>
                <div className="flex gap-3">
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                        selectedSize === size
                          ? 'bg-gradient-to-br from-gray-900 to-gray-800 text-white shadow-lg ring-2 ring-offset-2 ring-gray-900'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border-2 border-transparent'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Wishlist Button with Enhanced Design */}
            <div className="flex items-center gap-4 pt-2">
              <button
                onClick={handleWishlistClick}
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 ${
                  isProductInWishlist && isAuthenticated
                    ? 'bg-red-50 text-red-600 hover:bg-red-100 shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md border border-gray-200'
                }`}
              >
                <svg
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${isProductInWishlist && isAuthenticated ? 'fill-current' : ''}`}
                  viewBox="0 0 20 20"
                  fill={isProductInWishlist && isAuthenticated ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {isProductInWishlist && isAuthenticated
                    ? 'Remove from Wishlist'
                    : 'Add to Wishlist'}
                </span>
              </button>
            </div>

            {/* Action Buttons with Enhanced Design */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md ${
                  isOutOfStock
                    ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                    : isProductInCart
                    ? "bg-gradient-to-r from-green-600 to-green-700 text-white hover:shadow-lg"
                    : "bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:shadow-lg hover:from-amber-700 hover:to-amber-800"
                }`}
              >
                {isOutOfStock ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path>
                    </svg>
                    Not Available
                  </span>
                ) : isProductInCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    Added to Cart ✓
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.5 6M17 13l1.5 6M9 21h6M12 21v-6"></path>
                    </svg>
                    Add to Cart
                  </span>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-6 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-[1.02] shadow-md ${
                  isOutOfStock
                    ? "bg-gray-300 cursor-not-allowed text-gray-500 shadow-none"
                    : "bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-xl hover:from-gray-800 hover:to-gray-900"
                }`}
              >
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                  Buy it now
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}

export default DetailCard;