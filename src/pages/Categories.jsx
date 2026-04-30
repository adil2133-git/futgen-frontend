import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRef } from "react";
import api from '../api/Axios';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartProvider';
import { useWishlist } from '../context/WishlistProvider';
import { useAuth } from '../context/AuthProvider';
import { toast } from 'sonner';

function Categories() {
  const { categoryName } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categoryName || 'tshirts');
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated } = useAuth();

  const categoryDisplayNames = {
    tshirts: 'T-SHIRTS COLLECTION',
    jackets: 'JACKETS COLLECTION',
    sweatshirts: 'SWEATSHIRTS COLLECTION',
    joggers: 'JOGGERS COLLECTION',
    all: 'BROWSE MORE COLLECTIONS'
  };

  const categoryDescriptions = {
    tshirts: 'Premium cotton t-shirts for the modern football fan',
    jackets: 'Stylish jackets to keep you warm in style',
    sweatshirts: 'Comfortable sweatshirts for everyday wear',
    joggers: 'Perfect fit joggers for casual comfort'
  };

  const fetchProducts = async () => {
    if (loading) return
    setLoading(true)

    try {
      const response = await api.get('/products', {
        params: {
          category: selectedCategory,
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
      console.error(err)
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory]);

  useEffect(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory]);

  useEffect(() => {
    if (categoryName) {
      setSelectedCategory(categoryName);
    }
  }, [categoryName]);

  const observer = useRef();

  const lastProductRef = (node) => {
    if (loading || !hasMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setPage(prev => prev + 1);
      }
    });
    if (node) observer.current.observe(node);
  };

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

  const categories = [
    { id: 'tshirts', name: 'T-SHIRTS' },
    { id: 'jackets', name: 'JACKETS' },
    { id: 'sweatshirts', name: 'SWEATSHIRTS' },
    { id: 'joggers', name: 'JOGGERS' }
  ];

  const isOutOfStock = (product) => product?.stock === 0;
  const isLowStock = (product) => product?.stock > 0 && product?.stock < 10;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {categoryDisplayNames[selectedCategory] || 'BROWSE MORE COLLECTIONS'}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              {categoryDescriptions[selectedCategory] || 'Discover our premium collection of football-inspired apparel'}
            </p>
          </div>

          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    navigate(`/category/${category.id}`);
                  }}
                  className={`px-6 py-3 rounded-xl font-semibold text-sm md:text-base transition-all duration-300 transform hover:scale-105 ${selectedCategory === category.id
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-xl'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-12">
            {products.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {products.map((product, index) => {
                    const ProductCard = () => (
                      <div
                        className="bg-white rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-300 group/card cursor-pointer transform hover:-translate-y-2"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        <div className="relative overflow-hidden rounded-t-2xl">
                          <img
                            src={product.image}
                            className="w-full h-80 object-cover rounded-t-2xl transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                            alt={product.name}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found';
                            }}
                          />

                          {/* Stock Badge */}
                          {isOutOfStock(product) && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-red-600 to-red-700 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
                              Out of Stock
                            </div>
                          )}
                          {isLowStock(product) && (
                            <div className="absolute top-3 left-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                              ⚡ Only {product.stock} left!
                            </div>
                          )}

                          {/* Wishlist */}
                          <button
                            onClick={(e) => handleWishlistClick(e, product)}
                            className="absolute top-3 right-3 bg-white rounded-full p-2.5 shadow-lg hover:bg-gray-100 transition-all duration-300 opacity-0 group-hover/card:opacity-100 transform hover:scale-110"
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

                          {/* Cart */}
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            disabled={isOutOfStock(product)}
                            className={`absolute bottom-4 right-4 px-4 py-2.5 rounded-xl text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-all duration-300 transform hover:scale-105 ${isOutOfStock(product)
                                ? 'bg-gray-400 cursor-not-allowed text-white'
                                : isInCart(product.id)
                                  ? 'bg-green-600 text-white hover:bg-green-700'
                                  : 'bg-gradient-to-r from-gray-900 to-gray-800 text-white hover:shadow-xl'
                              }`}
                          >
                            {isOutOfStock(product) ? 'Out of Stock' : isInCart(product.id) ? '✓ In Cart' : '+ Quick add'}
                          </button>
                        </div>

                        <div className="p-6">
                          <h3 className="font-bold text-lg mb-2 text-gray-900 line-clamp-1">{product.name}</h3>
                          <p className="text-2xl font-bold text-gray-900 mb-3">
                            {product.price.toLocaleString("en-IN", {
                              style: "currency",
                              currency: "INR"
                            })}
                          </p>
                          <div className="flex items-center justify-between">
                            {product.category && (
                              <span className="inline-block bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full font-medium">
                                {product.category.toUpperCase()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );

                    if (index === products.length - 1) {
                      return <div ref={lastProductRef} key={product.id}><ProductCard /></div>;
                    }
                    return <div key={product.id}><ProductCard /></div>;
                  })}
                </div>

                {loading && (
                  <div className="text-center py-8">
                    <div className="inline-flex items-center gap-3 text-gray-600 bg-white px-6 py-3 rounded-full shadow-md">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Loading more products...
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                  No products found in {categoryDisplayNames[selectedCategory]}
                </h3>
                <p className="text-gray-500 mb-8">
                  We're constantly adding new products. Check back soon!
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('tshirts');
                    navigate('/category/tshirts');
                  }}
                  className="bg-gradient-to-r from-gray-900 to-gray-800 text-white px-8 py-3 rounded-xl hover:shadow-xl transition-all duration-300 font-semibold transform hover:scale-105"
                >
                  View All Collections
                </button>
              </div>
            )}
          </div>

          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl shadow-xl p-8 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">Premium Football Apparel</h2>
            <p className="text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Explore our exclusive collection of football-inspired clothing.
              From vintage t-shirts to premium jackets, sweatshirts, and joggers -
              each piece is designed for true football enthusiasts who want to showcase their passion for the beautiful game.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Categories;