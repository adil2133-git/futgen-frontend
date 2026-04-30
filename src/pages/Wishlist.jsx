import React from 'react';
import { useWishlist } from '../context/WishlistProvider';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function Wishlist() {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const navigate = useNavigate();

  const handleMoveToCart = (product) => {
    addToCart(product._id || product.id, "M");  // default size M
    removeFromWishlist(product._id);
};

  const handleRemoveFromWishlist = (productId) => {
    removeFromWishlist(productId);
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  if (wishlist.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Save your favorite items here to keep track of what you love and want to purchase later.
            </p>
            <button
              onClick={() => navigate('/product')}
              className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition-colors font-semibold"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Wishlist</h1>
            <p className="text-gray-600">{wishlist.length} {wishlist.length === 1 ? 'item' : 'items'}</p>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card"
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover/card:scale-110 cursor-pointer"
                  alt={product.name}
                  onClick={() => handleProductClick(product._id)}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                  }}
                />

                {/* Wishlist Remove Button */}
                <button
                  onClick={() => handleRemoveFromWishlist(product._id)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors opacity-0 group-hover/card:opacity-100"
                >
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div className="p-4">
                <h3
                  className="font-semibold text-lg mb-2 text-gray-900 cursor-pointer hover:text-red-600 transition-colors"
                  onClick={() => handleProductClick(product._id)}
                >
                  {product.name}
                </h3>
                <p className="text-gray-600 font-medium mb-4">
                  {product.price?.toLocaleString("en-IN", { style: "currency", currency: "INR" })}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleMoveToCart(product)}
                    className={`flex-1 py-2 px-4 rounded-lg font-medium text-sm transition-colors ${isInCart(product._id)
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-red-600 text-white hover:bg-red-700'
                      }`}
                  >
                    {isInCart(product._id) ? '✓ In Cart' : 'Move to Cart'}
                  </button>

                  <button
                    onClick={() => handleRemoveFromWishlist(product._id)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Wishlist;