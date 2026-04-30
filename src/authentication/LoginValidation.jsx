import React from 'react'
import * as Yup from 'yup'

export const LoginValidation = Yup.object({
    email:Yup.string()
        .email('Please Enter Valid email').matches(/^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z]{2,})+$/, 'Please enter a valid email')
        .required("Please Enter email"),
    password: Yup.string()
        .min(6, "Password must be at least 6 characters")
        .required("Password is required")})