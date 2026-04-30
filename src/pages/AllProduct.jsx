import React, { useState, useEffect } from 'react';
import api from '../api/Axios';
import Navbar from '../components/Navbar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartProvider';
import { useRef } from 'react';
import { useWishlist } from '../context/WishlistProvider';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'sonner';

function AllProduct() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();
  const observer = useRef()

  const fetchProducts = async () => {
    if (loading) return;

    setLoading(true)

    try {
      const searchQuery = searchParams.get('search') || "";

      const response = await api.get('/products', {
        params: {
          search: searchQuery,
          page: page,
          limit: 8
        }
      });

      setProducts(prev => {
        const newProducts = response.data.Product;
        const uniqueProducts = newProducts.filter(
          newItem => !prev.some(p => p.id === newItem.id)
        );
        return [...prev, ...uniqueProducts];
      });
      setHasMore(response.data.hasMore);
    } catch (err) {
      console.error("Error fetching products", err);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchParams]);

  useEffect(() => {
    setProducts([]);
    setPage(1)
    setHasMore(true)
  }, [searchParams])

  const lastProductRef = (node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1)
      }
    })
    if (node) observer.current.observe(node)
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return;
    }

    if (product?.stock === 0) {
      toast.error('This product is out of stock');
      return;
    }

    addToCart(product.id, "M");
    toast.success('Product added to cart!');
  };

  const handleWishlistClick = async (e, product) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist');
      return;
    }

    try {
      if (isInWishlist(product.id)) {
        await removeFromWishlist(product.id);
        toast.success('Product removed from wishlist');
      } else {
        await addToWishlist(product.id);
        toast.success('Product added to wishlist');
      }
    } catch (error) {
      console.error("Wishlist action failed:", error);
      toast.error('Failed to update wishlist');
    }
  };

  const isOutOfStock = (product) => product?.stock === 0;
  const isLowStock = (product) => product?.stock > 0 && product?.stock < 10;

  return (
    <>
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl">
        <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          EXPLORE COLLECTION
        </h2>

        {searchParams.get('search') && (
          <div className="mb-6 p-4 bg-white rounded-lg shadow-sm border-l-4 border-amber-500">
            <p className="text-gray-700">
              <span className="font-semibold">Showing results for:</span> "{searchParams.get('search')}"
              {products.length === 0 && ' - No products found'}
            </p>
          </div>
        )}

        <div className="mb-8 last:mb-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {products.map((product, index) => {
              const ProductCard = () => (
                <div
                  className="bg-white rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group/card cursor-pointer transform hover:-translate-y-1"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <img
                      src={product.image}
                      className="w-full h-64 object-cover rounded-t-2xl transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                      alt={product.name}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                      }}
                    />

                    {/* Stock Badge */}
                    {isOutOfStock(product) && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                        Out of Stock
                      </div>
                    )}
                    {isLowStock(product) && (
                      <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                        Only {product.stock} left!
                      </div>
                    )}

                    {/* Wishlist Button */}
                    <button
                      onClick={(e) => handleWishlistClick(e, product)}
                      className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover/card:opacity-100 transform hover:scale-110"
                    >
                      <svg
                        className={`w-5 h-5 ${isInWishlist(product.id) && isAuthenticated ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                        viewBox="0 0 20 20"
                        fill={isInWishlist(product.id) && isAuthenticated ? "currentColor" : "none"}
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </button>

                    {/* Quick Add Button */}
                    <button
                      onClick={(e) => handleAddToCart(e, product)}
                      disabled={isOutOfStock(product)}
                      className={`absolute bottom-3 right-3 px-4 py-2 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform hover:scale-105 ${isOutOfStock(product)
                          ? 'bg-gray-400 cursor-not-allowed text-white'
                          : isInCart(product.id)
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-lg'
                        }`}
                    >
                      {isOutOfStock(product) ? 'Out of Stock' : isInCart(product.id) ? '✓ In Cart' : '+ Quick add'}
                    </button>
                  </div>

                  <div className="p-5">
                    <p className="font-semibold text-lg mb-2 text-gray-900 line-clamp-1">{product.name}</p>
                    <p className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {product.price.toLocaleString("en-IN", {
                        style: "currency",
                        currency: "INR"
                      })}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      {product.category && (
                        <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                          {product.category.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );

              if (index === products.length - 1) {
                return <div ref={lastProductRef} key={product.id || product.product_id}><ProductCard /></div>;
              }
              return <div key={product.id || product.product_id}><ProductCard /></div>;
            })}

          </div>
          {loading && (
            <div className="text-center py-8">
              <div className="inline-flex items-center gap-2 text-gray-600">
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading more products...
              </div>
            </div>
          )}
        </div>

        {products.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <svg className="w-20 h-20 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
            <p className="text-gray-500 text-lg">No products found</p>
          </div>
        )}
      </div>
    </>
  );
}

export default AllProduct;