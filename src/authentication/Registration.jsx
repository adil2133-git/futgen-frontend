import React from 'react'
import { Formik, Form, Field } from 'formik'
import { SignupValidation } from './SignupValidation'
import SIGNUP from '../assets/SIGNUP.webp'
import { useNavigate } from 'react-router-dom'
import SimpleNavbar from '../components/SimpleNavbar'
import { useAuth } from '../context/AuthProvider'
import { toast } from 'sonner'

const initialValues = {
  Fname: '',
  Lname: '',
  email: '',
  password: '',
  cpassword: ''
}

function Registration() {
  const { register, loading, error, clearError } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting }) => {
    clearError()

    if (values.password !== values.cpassword) {
      toast.error('Passwords do not match')
      setSubmitting(false)
      return
    }

    const result = await register(values)

    if (result.success) {
      toast.success(result.message)
      navigate('/verify-otp', {state: {email: values.email}})
    } else {
      toast.error(result.message)
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
                src={SIGNUP}
                alt="Football"
                className="w-full max-w-sm rounded-2xl shadow-2xl"
              />
            </div>

            <div className="w-full md:w-1/2 max-w-md">
              <Formik
                initialValues={initialValues}
                validationSchema={SignupValidation}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={handleSubmit}
              >
                {({ errors, isSubmitting }) => (
                  <Form className="bg-black/80 backdrop-blur-lg shadow-2xl shadow-black/50 rounded-2xl p-6 border border-gray-800 hover:border-gray-700 transition-all duration-300">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold text-white mb-2">Create Account</h2>
                      <p className="text-gray-400 text-sm">Join us and get started</p>
                    </div>

                    {error && (
                      <div className="mb-4 p-3 bg-red-900/50 border border-red-700 rounded-lg">
                        <p className="text-red-300 text-sm text-center">{error}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="relative">
                        <label className="block text-gray-300 text-sm font-semibold mb-2">First Name</label>
                        <Field
                          type="text"
                          name="Fname"
                          className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                          placeholder="First name"
                        />
                        <div className="absolute -bottom-5 left-0">
                          {errors.Fname && <small className="text-red-400 text-xs">{errors.Fname}</small>}
                        </div>
                      </div>

                      <div className="relative">
                        <label className="block text-gray-300 text-sm font-semibold mb-2">Last Name</label>
                        <Field
                          type="text"
                          name="Lname"
                          className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                          placeholder="Last name"
                        />
                        <div className="absolute -bottom-5 left-0">
                          {errors.Lname && <small className="text-red-400 text-xs">{errors.Lname}</small>}
                        </div>
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Email</label>
                      <Field
                        type="email"
                        name="email"
                        className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                        placeholder="Enter your email"
                      />
                      <div className="absolute -bottom-5 left-0">
                        {errors.email && <small className="text-red-400 text-xs">{errors.email}</small>}
                      </div>
                    </div>

                    <div className="relative mb-4">
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                      <Field
                        type="password"
                        name="password"
                        className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                        placeholder="Create password"
                      />
                      <div className="absolute -bottom-5 left-0">
                        {errors.password && <small className="text-red-400 text-xs">{errors.password}</small>}
                      </div>
                    </div>

                    <div className="relative mb-6">
                      <label className="block text-gray-300 text-sm font-semibold mb-2">Confirm Password</label>
                      <Field
                        type="password"
                        name="cpassword"
                        className="w-full px-3 py-2 border border-gray-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 bg-gray-900/50 text-white placeholder-gray-500 text-sm"
                        placeholder="Confirm password"
                      />
                      <div className="absolute -bottom-5 left-0">
                        {errors.cpassword && <small className="text-red-400 text-xs">{errors.cpassword}</small>}
                      </div>
                    </div>

                    <div className="text-center">
                      <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 w-full text-sm disabled:cursor-not-allowed"
                      >
                        {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                      </button>
                    </div>

                    <div className="text-center mt-4">
                      <p className="text-gray-400 text-xs">
                        Already have an account? <a href="/login" className="text-red-500 hover:text-red-400 font-semibold">Sign In</a>
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

  export default Registration