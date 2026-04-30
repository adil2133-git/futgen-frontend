import React from 'react'
import { useNavigate } from 'react-router-dom'

function SimpleNavbar() {
  const navigate = useNavigate()

  const goToHome = () => {
    navigate('/')
  }

  return (
    <nav className="bg-black/90 backdrop-blur-lg border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <h2 className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            FUTGEN
          </h2>

          <button
            onClick={goToHome}
            className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border border-red-600 transition-all duration-300 group"
            title="Go to Home"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 text-white group-hover:scale-110 transition-transform duration-300" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" 
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default SimpleNavbar
