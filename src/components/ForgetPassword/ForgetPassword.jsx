import axios from 'axios'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { AuthContext } from '../Context/AuthContextProvider'
import backgroundImage from '../../assets/images/img1.jpg'

export default function ForgetPassword() {
    let { setToken } = useContext(AuthContext)
    let [errorMessage, setError] = useState(null)
    let [formDisplay, setformDisplay] = useState(true)
    let navg = useNavigate()
    let validYup = Yup.object({
        email: Yup.string().required("email required").email("enter valid email"),
    })
    let valid2Yup = Yup.object({
        resetCode: Yup.string().required("resetCode is required"),
    })
    let ForgetForm = useFormik({
        initialValues: {
            email: "",
        },
        onSubmit: ForgetPasswordApi,
        validationSchema: validYup
    });
    let verifyResetCodeForm = useFormik({
        initialValues: {
            resetCode: "",
        },
        onSubmit: verifyResetCodeApi,
        validationSchema: valid2Yup
    });
    // function verifyResetCodeApi(data) {
    //     axios.post(`http://localhost:3000/api/v1/auth/resetPassword`, data)
    //         .then((req) => {
    //             if(req.data.status == 'Success')
    //             navg('/updatePassword')

    //         })
    //         .catch((err) => {
    //             setError(err.response.data.message)
    //         });
    // }
    // function ForgetPasswordApi(data) {
    //     axios.post(`http://localhost:3000/api/v1/auth/forgetPassword`, data)
    //         .then((req) => {
    //             console.log(req.data)
    //             if (req.data.statusMsg == 'success') {
    //                 setformDisplay(false)
    //             }

    //         })
    //         .catch((err) => {
    //             setError(err.response.data.message)
    //         });

    // }





    function verifyResetCodeApi(data) {
  axios.post('http://localhost:3000/api/v1/auth/resetPassword', data)
    .then((res) => {
      if (res.status === 200 && res.data.status === 'Success') {
        console.log("Password reset successful");
        navg('/updatePassword'); // Redirect to update password page
      }
    })
    .catch((err) => {
      if (err.response) {
        const status = err.response.status;

        if (status === 400) {
          setError("Invalid or expired token.");
        } else if (status === 500) {
          setError("Internal Server Error. Please try again later.");
        } else {
          setError(`Unexpected error: ${status}`);
        }
      }
    });
}
function ForgetPasswordApi(data) {
  axios.post('http://localhost:3000/api/v1/auth/forgetPassword', data)
    .then((res) => {
      if (res.status === 200) {
        console.log("Password reset email sent.");
        setformDisplay(false); // Hide form
      }
    })
    .catch((err) => {
      if (err.response) {
        const status = err.response.status;

                    if (status === 404) {
                        setError("User not found.");
                    } else if (status === 500) {
                        setError("Internal Server Error. Please try again later.");
                    } else {
                        setError(`Unexpected error: ${status}`);
                    }
                }
            });
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
                    {formDisplay ? (
                        <>
                            <h2 className="my-4 text-center text-3xl pb-5">
                                Forgot Password
                            </h2>

                            {errorMessage && (
                                <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={ForgetForm.handleSubmit} className="space-y-6">
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
                                            onChange={ForgetForm.handleChange}
                                            onBlur={ForgetForm.handleBlur}
                                            value={ForgetForm.values.email}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FD4857] focus:border-[#FD4857] sm:text-sm"
                                        />
                                        {ForgetForm.touched.email && ForgetForm.errors.email && (
                                            <div className="text-red-500 text-xs mt-1">{ForgetForm.errors.email}</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={!(ForgetForm.isValid && ForgetForm.dirty)}
                                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FD4857] to-[#FAB113] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857] ${
                                            !(ForgetForm.isValid && ForgetForm.dirty) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        Send Reset Code
                                    </button>
                                </div>
                            </form>
                        </>
                    ) : (
                        <>
                            <h2 className="my-4 text-center text-3xl pb-5">
                                Enter Reset Code
                            </h2>

                            {errorMessage && (
                                <div className="mb-4 p-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                                    {errorMessage}
                                </div>
                            )}

                            <form onSubmit={verifyResetCodeForm.handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="resetCode" className="block text-sm font-medium text-gray-700">
                                        Reset Code
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="resetCode"
                                            name="resetCode"
                                            type="text"
                                            onChange={verifyResetCodeForm.handleChange}
                                            onBlur={verifyResetCodeForm.handleBlur}
                                            value={verifyResetCodeForm.values.resetCode}
                                            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FD4857] focus:border-[#FD4857] sm:text-sm"
                                        />
                                        {verifyResetCodeForm.touched.resetCode && verifyResetCodeForm.errors.resetCode && (
                                            <div className="text-red-500 text-xs mt-1">{verifyResetCodeForm.errors.resetCode}</div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <button
                                        type="submit"
                                        disabled={!(verifyResetCodeForm.isValid && verifyResetCodeForm.dirty)}
                                        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FD4857] to-[#FAB113] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857] ${
                                            !(verifyResetCodeForm.isValid && verifyResetCodeForm.dirty) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        Verify Code
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
