import React from 'react'

function NewsLetter() {
  return (
    <div className="py-16 bg-white border-t border-gray-200">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h3 className="text-3xl font-bold mb-4 text-gray-900">STAY IN THE GAME</h3>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm">
          Get exclusive access to new drops, special promotions, and football culture content
        </p>
        <div className="flex max-w-md mx-auto">
          <input 
            type="email" 
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-l-lg bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-sm"
          />
          <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-r-lg font-semibold transition-colors duration-300 border border-red-600 hover:border-red-700 text-sm">
            SUBSCRIBE
          </button>
        </div>
        <p className="text-gray-500 text-xs mt-4">
          By subscribing, you agree to our Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default NewsLetter