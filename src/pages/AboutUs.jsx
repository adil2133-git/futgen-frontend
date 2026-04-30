import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AboutHero from '../assets/about1.png';
import TeamImage from '../assets/jacket2.webp';
import QualityImage from '../assets/jacket3.webp';

function AboutUs() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white">
        <div className="relative bg-gray-900 min-h-screen">
          <div className="absolute inset-0 overflow-hidden">
            <img
              src={AboutHero}
              alt="Football Stadium"
              className="w-full h-full object-cover opacity-40"
              onError={(e) => {
                e.target.src =
                  'https://images.unsplash.com/photo-1556056504-5c7696c4c28d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80';
              }}
            />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 h-screen flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold text-white mb-6">About FUTGEN</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Elevating Football Culture Through Premium Apparel
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
              <div className="space-y-6">
                <p className="text-lg text-gray-600 leading-relaxed">
                  FUTGEN emerged from the heart of football culture, founded in 2025 by a collective of
                  passionate football enthusiasts and visionary designers. We recognized a gap in the market
                  for premium football apparel that truly resonates with the modern fan's lifestyle.
                </p>

                <p className="text-lg text-gray-600 leading-relaxed">
                  Our journey began with a simple mission: to create clothing that bridges the gap between
                  stadium passion and streetwear style. We believe that football is more than just a sport -
                  it's a global language that connects millions, and your apparel should reflect that unity.
                </p>
              </div>

              <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Our Vision</h3>
                <p className="text-gray-600">
                  To become the leading global brand for football-inspired lifestyle apparel, celebrated for
                  quality, innovation, and authentic connection to the beautiful game.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gray-200 rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src={TeamImage}
                  alt="FUTGEN Team"
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.target.src =
                      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                  }}
                />
              </div>

              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-lg p-6 w-3/4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">2025</div>
                  <div className="text-sm text-gray-600 uppercase tracking-wider">Established</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 py-20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-white rounded-2xl overflow-hidden shadow-xl">
                  <img
                    src={QualityImage}
                    alt="Premium Quality"
                    className="w-full h-96 object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://images.unsplash.com/photo-1558769132-cb25c5d1d1c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80';
                    }}
                  />
                </div>
              </div>

              <div className="order-1 lg:order-2">
                <h2 className="text-4xl font-bold text-gray-900 mb-8">Our Commitment</h2>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Quality Craftsmanship</h3>
                    <p className="text-gray-600">
                      Every FUTGEN product is crafted with meticulous attention to detail, using premium
                      materials that ensure durability, comfort, and style that lasts beyond the final whistle.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Authentic Design</h3>
                    <p className="text-gray-600">
                      Our designs are born from genuine football culture, blending heritage elements with
                      contemporary aesthetics to create pieces that truly speak to the heart of the game.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">Community First</h3>
                    <p className="text-gray-600">
                      We're building more than a brand - we're building a community. FUTGEN is by the fans,
                      for the fans, and every decision we make is with our community in mind.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose FUTGEN</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Experience the difference that passion, quality, and authentic football culture makes
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Premium Materials</h3>
                <p className="text-gray-600">
                  We source only the finest fabrics and materials, ensuring every piece feels as good as it looks.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Unique Designs</h3>
                <p className="text-gray-600">
                  Stand out from the crowd with our exclusive designs that celebrate football heritage with modern style.
                </p>
              </div>

              <div className="text-center p-8 bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Fan Community</h3>
                <p className="text-gray-600">
                  Join a growing community of football enthusiasts who share your passion for the beautiful game.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-6">Ready to Represent?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of football fans who have already elevated their style with FUTGEN.
              Discover our collections and wear your passion with pride.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => (window.location.href = '/product')}
                className="bg-red-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-red-700 transition-colors text-lg"
              >
                Shop Collection
              </button>

              <button
                onClick={() => (window.location.href = '/categories')}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-gray-900 transition-colors text-lg"
              >
                Browse Categories
              </button>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

export default AboutUs;
