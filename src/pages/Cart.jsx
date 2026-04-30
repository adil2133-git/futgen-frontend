import React from 'react';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartProvider';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getCartTotal,
    getSubTotal,
    getItemTotal,
    getCartItemCount,
    clearCart
  } = useCart();

  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate('/checkout');
  };

  const handleContinueShopping = () => {
    navigate('/product');
  };

  // Check if any item is out of stock
  const hasOutOfStock = cart.some(item => item.productId.stock === 0);

  if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some products to your cart to see them here.</p>
            <button
              onClick={handleContinueShopping}
              className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </>
    );
  }

  const subtotal = getSubTotal();
  const total = getCartTotal();
  const shipping = 0;
  const tax = 0;

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-gray-900">
                Shopping Cart ({getCartItemCount()} {getCartItemCount() === 1 ? 'item' : 'items'})
              </h1>
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-800 font-medium"
              >
                Clear Cart
              </button>
            </div>

            <div className="space-y-4">
              {cart.map((item) => {
                const itemTotal = getItemTotal(item);
                const isMaxQuantity = item.quantity >= item.productId.stock;
                const isOutOfStock = item.productId.stock === 0;
                const isLowStock = item.productId.stock > 0 && item.productId.stock < 10;

                return (
                  <div key={item.productId._id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="sm:w-24 sm:h-24 w-full h-48 flex-shrink-0">
                        <img
                          src={item.productId.image}
                          alt={item.productId.name}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/150x150?text=Image+Not+Found';
                          }}
                        />
                      </div>

                      <div className="flex-grow">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          {item.productId.name}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {item.productId.price.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR"
                          })}
                        </p>
                        <p className="text-gray-500 text-sm">Size: {item.size}</p>

                        {/* Stock Status */}
                        {isOutOfStock && (
                          <p className="text-red-500 text-sm mt-1 font-medium">
                            Out of Stock
                          </p>
                        )}

                        {isLowStock && (
                          <p className="text-orange-500 text-sm mt-1 font-medium">
                            Only {item.productId.stock} left
                          </p>
                        )}

                        <div className="flex items-center gap-4 mt-3">
                          <span className="text-gray-700 font-medium">Quantity:</span>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => decreaseQuantity(item.productId._id, item.size)}
                              className="w-8 h-8 border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
                            >
                              -
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => increaseQuantity(item.productId._id, item.size)}
                              disabled={isMaxQuantity}
                              className={`w-8 h-8 border border-gray-300 rounded flex items-center justify-center transition-colors ${isMaxQuantity
                                  ? "bg-gray-200 cursor-not-allowed text-gray-500"
                                  : "hover:bg-gray-100"
                                }`}
                            >
                              +
                            </button>
                          </div>
                          {/* Max quantity reached message */}
                          {isMaxQuantity && !isOutOfStock && item.productId.stock > 0 && (
                            <p className="text-xs text-orange-500">
                              Max available quantity reached
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between">
                        <p className="text-lg font-semibold text-gray-900">
                          ₹{itemTotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                        </p>
                        <button
                          onClick={() => removeFromCart(item.productId._id, item.size)}
                          className="text-red-600 hover:text-red-800 font-medium text-sm mt-2"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{subtotal.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹{shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <hr className="my-2" />
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={hasOutOfStock}
                className={`w-full py-3 px-6 rounded-lg font-semibold text-lg transition-colors mb-4 ${hasOutOfStock
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-black text-white hover:bg-gray-800"
                  }`}
              >
                {hasOutOfStock ? "Remove Out of Stock Items" : "Proceed to Checkout"}
              </button>

              <button
                onClick={handleContinueShopping}
                className="w-full border border-gray-300 text-gray-900 py-3 px-6 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;