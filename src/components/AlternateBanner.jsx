import React from 'react'
import banner2 from '../assets/banner2.webp'

function AlternateBanner() {
  return (
    <div className="relative w-full">
        <img 
        src={banner2}
        alt='banner'
        className="w-full block"
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-1xl md:text-2xl lg:text-3xl font-bold text-center drop-shadow-2xl tracking-wider font-sans">
            FOR THE LOVE OF THE GAME
        </div>
    </div>
  )
}

export default AlternateBanner