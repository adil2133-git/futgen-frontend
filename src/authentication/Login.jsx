import { Field, Form, Formik } from 'formik'
import React from 'react'
import LOGIN from '../assets/LOGIN.webp'
import { useNavigate } from 'react-router-dom'
import { LoginValidation } from './LoginValidation'
import SimpleNavbar from '../components/SimpleNavbar'
import { useAuth } from '../context/AuthProvider'
import api from '../api/Axios'

function Login() {
  const { login, loading, error, clearError, checkAuthStatus } = useAuth()
  const navigate = useNavigate()

  const initialValues = {
    email: '',
    password: ''
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    clearError()

    const result = await login(values.email, values.password)

    if (result.success) {
      await checkAuthStatus()
      
      const res = await api.get("/users/getUser")
      const role = res.data.user?.role

      
      if (role === "admin") {
        navigate('/admin/home') 
      } else {
        navigate('/') 
      }
    }

    setSubmitting(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <SimpleNavbar />
      <div className="flex items-center justify-center p-4 pt-16">
        <div className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-center gap-8">
          <div className="w-full md:w-1/2 flex justify-center">
            <img
              src={LOGIN}
              alt="Football Login"
              className="w-full max-w-md rounded-2xl shadow-2xl"
            />
          </div>

          <div className="w-full md:w-1/2 max-w-md">
            <Formik
              initialValues={initialValues}
              validationSchema={LoginValidation}
              validateOnBlur={false}
              validateOnChange={false}
              onSubmit={handleSubmit}
            >
              {({ errors, isSubmitting }) => (
                <Form className="bg-black/80 backdrop-blur-lg shadow-2xl shadow-black/50 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                    <p className="text-gray-400 text-sm">Sign in to your account</p>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                      <p className="text-red-300 text-sm text-center">{error}</p>
                    </div>
                  )}

                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                      placeholder="Enter your email"
                    />
                    {errors.email && (
                      <div className="text-red-400 text-xs mt-2 ml-1">{errors.email}</div>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                    <Field
                      type="password"
                      name="password"
                      className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                      placeholder="Enter your password"
                    />
                    {errors.password && (
                      <div className="text-red-400 text-xs mt-2 ml-1">{errors.password}</div>
                    )}
                  </div>

                  <div>
                    <button
                      type="submit"
                      disabled={isSubmitting || loading}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 w-full text-sm disabled:cursor-not-allowed"
                    >
                      {loading ? 'SIGNING IN...' : 'SIGN IN'}
                    </button>
                  </div>

                  <div className="text-center mt-4">
                    <p className="text-gray-400 text-xs">
                      Don't have an account? <a href="/signup" className="text-red-500 hover:text-red-400 font-semibold">Sign Up</a>
                    </p>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login