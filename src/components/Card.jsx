import React, { useState, useRef, useEffect } from 'react'
import api from '../api/Axios'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartProvider'
import { useWishlist } from '../context/WishlistProvider'
import { useAuth } from '../context/AuthProvider'
import { toast } from 'sonner'

function Card() {
  const [showLeftButton, setShowLeftButton] = useState(false)
  const [showRightButton, setShowRightButton] = useState(true)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const containerRef = useRef(null)
  const navigate = useNavigate()
  const { addToCart, isInCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data.Product || response.data.products || response.data.data || [])
        setLoading(false)
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const checkScrollPosition = () => {
    const container = containerRef.current
    if (container) {
      const { scrollLeft, scrollWidth, clientWidth } = container
      setShowLeftButton(scrollLeft > 0)
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scrollRight = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({ left: 320, behavior: 'smooth' })
    }
  }

  const scrollLeft = () => {
    const container = containerRef.current
    if (container) {
      container.scrollBy({ left: -320, behavior: 'smooth' })
    }
  }

  const handleAddToCart = (e, product) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    if (product?.stock === 0) {
      toast.error('This product is out of stock')
      return
    }

    addToCart(product.id, 'M')
    toast.success('Product added to cart!')
  }

  const handleWishlistClick = (e, product) => {
    e.stopPropagation()

    if (!isAuthenticated) {
      toast.error('Please login to manage wishlist')
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.success('Product removed from wishlist')
    } else {
      addToWishlist(product.id)
      toast.success('Product added to wishlist')
    }
  }

  useEffect(() => {
    checkScrollPosition()
    window.addEventListener('resize', checkScrollPosition)
    return () => {
      window.removeEventListener('resize', checkScrollPosition)
    }
  }, [])

  useEffect(() => {
    if (products?.length > 0) {
      setTimeout(checkScrollPosition, 100)
    }
  }, [products])

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
        <h2 className="text-3xl font-bold mb-8">EXPLORE</h2>
        <div className="flex justify-center items-center h-40">
          <p>Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-7xl mx-auto bg-gray-50 rounded-xl">
      <h2 className="text-3xl font-bold mb-8">EXPLORE</h2>
      <div className="relative group">
        <div
          ref={containerRef}
          className="flex overflow-x-auto gap-8 scroll-smooth"
          onScroll={checkScrollPosition}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {(products || []).slice(0, 6).map((product) => (
            <div
              key={product.id || product.product_id}
              className="flex-shrink-0 w-64 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group/card cursor-pointer"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="relative overflow-hidden rounded-t-xl">
                <img
                  src={product.image}
                  className="w-full h-64 object-cover rounded-t-xl transition-transform duration-500 ease-in-out group-hover/card:scale-110"
                  alt={product.name}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Found'
                  }}
                />

                {/* Stock Status Badge */}
                {product?.stock === 0 && (
                  <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    Out of Stock
                  </div>
                )}
                {product?.stock > 0 && product?.stock < 10 && (
                  <div className="absolute top-2 left-2 bg-orange-500 text-white px-2 py-1 rounded-md text-xs font-semibold">
                    Only {product.stock} left!
                  </div>
                )}

                {/* Wishlist Button */}
                <button
                  onClick={(e) => handleWishlistClick(e, product)}
                  className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors opacity-0 group-hover/card:opacity-100"
                >
                  <svg
                    className={`w-5 h-5 ${isInWishlist(product.id) && isAuthenticated ? 'text-red-500 fill-current' : 'text-gray-600'}`}
                    viewBox="0 0 20 20"
                    fill={isInWishlist(product.id) && isAuthenticated ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Quick Add Button */}
                <button
                  onClick={(e) => handleAddToCart(e, product)}
                  disabled={product?.stock === 0}
                  className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-sm font-medium opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 ${
                    product?.stock === 0
                      ? 'bg-gray-400 cursor-not-allowed text-white'
                      : isInCart(product.id)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {product?.stock === 0
                    ? 'Out of Stock'
                    : isInCart(product.id)
                    ? '✓ In Cart'
                    : '+ Quick add'}
                </button>
              </div>

              <div className="p-4">
                <p className="font-semibold text-lg mb-1">{product.name}</p>
                <p className="text-gray-600 font-medium">
                  {product.price.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR'
                  })}
                </p>
                {product.category && (
                  <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded mt-2">
                    {product.category.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {showLeftButton && (
          <button
            onClick={scrollLeft}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:bg-gray-100 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {showRightButton && (
          <button
            onClick={scrollRight}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-xl hover:bg-gray-100 border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default Card