import { Suspense, lazy } from 'react'
import './App.css'
import Registration from './authentication/Registration'
import Login from './authentication/Login'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { CartProvider } from './context/CartProvider'
import { WishlistProvider } from './context/WishlistProvider'
import AdminRoute from './components/AdminRoute'

const Home = lazy(() => import('./pages/Home'))
const AllProduct = lazy(() => import('./pages/AllProduct'))
const DetailCard = lazy(() => import('./pages/DetailCard'))
const Cart = lazy(() => import('./pages/Cart'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Categories = lazy(() => import('./pages/Categories'))
const AboutUs = lazy(() => import('./pages/AboutUs'))
const ContactUs = lazy(() => import('./pages/ContactUs'))
const OrderManagement = lazy(() => import('./admin/pages/OrderManagement'))
const ProductManagement = lazy(() => import('./admin/pages/ProductManagement'))
const UserManagement = lazy(() => import('./admin/pages/UserManagement'))
const AdminHome = lazy(() => import('./admin/pages/AdminHome'))
const YourOrders = lazy(() => import('./pages/YourOrders'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const OtpVerify = lazy(() => import('./pages/OtpVerify'))

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <Suspense fallback={<div>Loading...</div>}>
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
            </Suspense>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App