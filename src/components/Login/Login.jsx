import axios from 'axios'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { AuthContext } from '../Context/AuthContextProvider'
import { jwtDecode } from "jwt-decode"
import backgroundImage from '../../assets/images/img1.jpg'
import Loader from '../Loader/Loader'

export default function Login() {
  const { login } = useContext(AuthContext)
  const [errorMessage, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const validYup = Yup.object({
    email: Yup.string().required("Email is required").email("Enter a valid email"),
    password: Yup.string().required("Password is required").matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "Password must be 6-16 characters and include numbers and special characters"),
  })

  const initialValues = {
    email: "",
    password: "",
  }

  const LoginForm = useFormik({
    initialValues,
    onSubmit: LoginApi,
    validationSchema: validYup
  });

  async function LoginApi(data) {
    setLoading(true);
    setError(null);

    try {
      console.log('Sending login request with:', data);
      
      const response = await axios.post('http://localhost:3000/api/v1/auth/login', data);
      console.log('Login response:', response.data);
      
      if (response.data.token) {
        // Decode token to get user info
        const decodedToken = jwtDecode(response.data.token);
        console.log('Decoded token:', decodedToken);
        console.log('Token being stored:', response.data.token);
        
        // Store token using AuthContext login function
        login(response.data.token);
        
        // Store user data in localStorage
        if (response.data.user) {
          localStorage.setItem("userData", JSON.stringify(response.data.user));
        }
        
        // Verify token was stored
        const storedToken = localStorage.getItem("token");
        console.log('Token in localStorage:', storedToken);
        console.log('Decoded stored token:', storedToken ? jwtDecode(storedToken) : null);
        
        // Get role from user data or token
        const userRole = response.data.user?.role || decodedToken.role;
        localStorage.setItem("userRole", userRole);

        // Redirect based on role
        switch (userRole) {
          case 'admin':
            navigate('/admin/dashboard');
            break;
          case 'trainer':
            navigate('/');
            break;
          case 'client':
            navigate('/');
            break;
          default:
            navigate('/');
        }
      } else {
        setError("Invalid response from server");
      }
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error response:', err.response);
      
      if (err.response) {
        switch (err.response.status) {
          case 401:
            setError("Invalid email or password");
            break;
          case 403:
            setError("Account is not activated");
            break;
          case 404:
            setError("Account not found");
            break;
          case 500:
            setError("Server error. Please try again later");
            break;
          default:
            setError(err.response.data.message || "An error occurred");
        }
      } else if (err.request) {
        setError("Network error. Please check your connection");
      } else {
        setError("An error occurred. Please try again");
      }
    } finally {
      setLoading(false);
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
            Sign in to your account
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
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {LoginForm.touched.email && LoginForm.errors.email && (
                  <div className="text-red-500 text-xs">{LoginForm.errors.email}</div>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  onChange={LoginForm.handleChange}
                  onBlur={LoginForm.handleBlur}
                  value={LoginForm.values.password}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {LoginForm.touched.password && LoginForm.errors.password && (
                  <div className="text-red-500 text-xs">{LoginForm.errors.password}</div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/ForgetPassword" className="font-medium text-[#FD4857] hover:text-[#e6414e]">
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={!(LoginForm.isValid && LoginForm.dirty) || loading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FD4857] to-[#FAB113] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857] ${
                  (!(LoginForm.isValid && LoginForm.dirty) || loading) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading ? (
                  <Loader/>
                ) : null}
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-sm text-center mt-4">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="font-medium text-[#FD4857] hover:text-[#e6414e]">
                Register here
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

