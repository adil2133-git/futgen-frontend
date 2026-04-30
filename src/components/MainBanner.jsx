import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

// Import your images (replace these with your actual image paths)
import banner1 from '../assets/banner.webp'
import banner2 from '../assets/banner5.jpg'
import banner3 from '../assets/banner3.webp'
import banner4 from '../assets/banner4.webp'

function MainBanner() {
  const navigate = useNavigate()
  const [currentSlide, setCurrentSlide] = useState(0)

  // Banner data array - each object contains image and text content
  const banners = [
    {
      image: banner1,
      title: "FOOTBALL MEETS FASHION",
      subtitle: "Premium streetwear for the modern football enthusiast",
      highlightWord: "MEETS"
    },
    {
      image: banner2,
      title: "STREET STYLE FOOTBALL",
      subtitle: "Where passion for the game meets urban fashion",
      highlightWord: "STYLE"
    },
    {
      image: banner3,
      title: "UNLEASH YOUR GAME",
      subtitle: "Performance wear that makes a statement off the pitch",
      highlightWord: "GAME"
    },
    {
      image: banner4,
      title: "COLLECTIONS 2025",
      subtitle: "Limited edition drops for true football fashionistas",
      highlightWord: "2025"
    }
  ]

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [banners.length])

  // Manual slide navigation (optional)
  const goToSlide = (index) => {
    setCurrentSlide(index)
  }

  // Function to split title and highlight the specific word
  const renderTitle = (title, highlightWord) => {
    const words = title.split(' ')
    return words.map((word, index) => (
      <span
        key={index}
        className={word === highlightWord ? "text-red-500" : ""}
      >
        {word}
        {index < words.length - 1 ? " " : ""}
      </span>
    ))
  }

  // Fixed navigation handler with debugging
  const handleShopNow = () => {
    console.log('Shop Now button clicked') // Debug log
    console.log('Navigating to /product') // Debug log
    navigate('/product')
  }

  return (
    <div className="relative h-screen min-h-[600px] overflow-hidden">
      {/* Slides */}
      {banners.map((banner, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img 
            src={banner.image}
            alt={`FUTGEN Football Fashion - Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center">
            <div className="max-w-7xl mx-auto px-6 text-white">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {renderTitle(banner.title, banner.highlightWord)}
              </h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl">
                {banner.subtitle}
              </p>
              <button 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative z-10"
                onClick={handleShopNow}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleShopNow()
                  }
                }}
                tabIndex={0}
              >
                SHOP NOW
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 cursor-pointer ${
              index === currentSlide ? 'bg-red-500 scale-125' : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default MainBanner