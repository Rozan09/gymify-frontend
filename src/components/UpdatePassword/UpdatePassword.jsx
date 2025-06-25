import axios from 'axios'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { AuthContext } from '../Context/AuthContextProvider'
import backgroundImage from '../../assets/images/img1.jpg'

export default function UpdatePassword() {
  const { setToken } = useContext(AuthContext)
  const [errorMessage, setError] = useState(null)
  const navg = useNavigate()
  
  const validYup = Yup.object({
    email: Yup.string().required("Email is required").email("Enter a valid email"),
    newPassword: Yup.string().required("Password is required").matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Password must be 6-16 characters and include numbers and special characters"),
  })

  const initialValues = {
    email: "",
    newPassword: "",
  }

  const LoginForm = useFormik({
    initialValues,
    onSubmit: updatePassword,
    validationSchema: validYup
  });

  async function updatePassword(data) {
    try {
      const response = await axios.put('http://localhost:3000/api/v1/auth/changePassword', data);
      if (response.data.token) {
        navg('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred");
    }
  }

  return (
    <div
      className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
    >
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <h2 className="my-4 text-center text-3xl pb-5">
            Update Password
          </h2>

          {errorMessage && (
            <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
              {errorMessage}
            </div>
          )}

          <form onSubmit={LoginForm.handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  onChange={LoginForm.handleChange}
                  onBlur={LoginForm.handleBlur}
                  value={LoginForm.values.email}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FD4857] focus:border-[#FD4857] sm:text-sm"
                />
                {LoginForm.touched.email && LoginForm.errors.email && (
                  <div className="text-red-500 text-xs mt-1">{LoginForm.errors.email}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <div className="mt-1">
                <input
                  id="newPassword"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  onChange={LoginForm.handleChange}
                  onBlur={LoginForm.handleBlur}
                  value={LoginForm.values.newPassword}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FD4857] focus:border-[#FD4857] sm:text-sm"
                />
                {LoginForm.touched.newPassword && LoginForm.errors.newPassword && (
                  <div className="text-red-500 text-xs mt-1">{LoginForm.errors.newPassword}</div>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!(LoginForm.isValid && LoginForm.dirty)}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FD4857] to-[#FAB113] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857] ${
                  !(LoginForm.isValid && LoginForm.dirty) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
