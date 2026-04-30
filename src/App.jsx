import { useState } from 'react'
import './App.css'
import Registration from './authentication/Registration'
import Login from './authentication/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import { AuthProvider } from './context/AuthProvider'
import AllProduct from './pages/AllProduct'
import DetailCard from './pages/DetailCard'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartProvider'
import Checkout from './pages/Checkout'
import Categories from './pages/Categories'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import OrderManagement from './admin/pages/OrderManagement'
import ProductManagement from './admin/pages/ProductManagement'
import UserManagement from './admin/pages/UserManagement'
import AdminHome from './admin/pages/AdminHome'
import YourOrders from './pages/YourOrders'
import { WishlistProvider } from './context/WishlistProvider'
import Wishlist from './pages/Wishlist'
import AdminRoute from './components/AdminRoute'
import OtpVerify from './pages/OtpVerify'

function App() {
  return (
    <>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Routes>
                <Route path='/verify-otp' element={<OtpVerify />} />
                <Route path='/signup' element={<Registration />} />
                <Route path='/login' element={<Login />} />
                <Route path='/' element={<Home />} />
                <Route path='/product' element={<AllProduct />} />
                <Route path='/product/:productId' element={<DetailCard />} />
                <Route path='/cart' element={<Cart />} />
                <Route path='/wishlist' element={<Wishlist />} />
                <Route path='/checkout' element={<Checkout />} />
                <Route path='/orders' element={<YourOrders />} />
                <Route path='/categories' element={<Categories />} />
                <Route path='/category/:categoryName' element={<Categories />} />
                <Route path='/about' element={<AboutUs />} />
                <Route path='/contact' element={<ContactUs />} />

                <Route element={<AdminRoute />}>
                  <Route path='/admin/home' element={<AdminHome />} />
                  <Route path='/admin/order' element={<OrderManagement />} />
                  <Route path='/admin/product' element={<ProductManagement />} />
                  <Route path='/admin/user' element={<UserManagement />} />
                </Route>
              </Routes>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </>
  )
}

export default App