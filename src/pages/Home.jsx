import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Card from '../components/Card'
import MainBanner from '../components/MainBanner'
import AlternateBanner from '../components/AlternateBanner'
import NewsLetter from '../components/NewsLetter'

function Home() {
  return (
    <div>
        <Navbar />
        <MainBanner />
        <Card />
        <AlternateBanner />
        <NewsLetter />
        <Footer />
    </div>
  )
}

export default Home