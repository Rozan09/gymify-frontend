import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Contact() {
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });

  const validationSchema = Yup.object({
    name: Yup.string()
      .required('Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Enter a valid email'),
    message: Yup.string()
      .required('Message is required')
      .min(10, 'Message must be at least 10 characters')
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      message: ''
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        console.log('Form submitted:', values);
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! We will get back to you soon.'
        });
        resetForm();
      } catch (error) {
        setSubmitStatus({
          type: 'error',
          message: 'Failed to send message. Please try again later.'
        });
      }
    }
  });

  return (
    <div className="min-h-screen pt-30 bg-white relative overflow-hidden flex items-center justify-center py-12">
      {/* Red curved shape */}
      <div className="absolute inset-0">
        <div className="absolute -left-4 top-0 w-1/2 h-3/4">
          <div className="w-full h-full rounded-br-[80%]" style={{ background: 'linear-gradient(135deg, rgb(0, 31, 63), rgb(0, 8, 20))', opacity: 0.9 }}></div>
        </div>
        {/* Light gray curved shape */}
        <div className="absolute -right-4 bottom-0 w-1/2 h-2/5">
          <div className="w-full h-full bg-gray-50 rounded-tl-[80%]"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-10 bg-white rounded-2xl p-8 shadow-lg">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent drop-shadow-sm">
            Get in touch
          </h1>
          <div className="max-w-2xl mx-auto">
            <p className="text-lg mb-2 text-gray-800 font-medium">
              Got a question? You might find the answer in our{' '}
              <a href="/help" className="text-[#ff4857] hover:text-[#ff6b77] font-semibold border-b-2 border-[#ff4857] hover:border-[#ff6b77] transition-all duration-200">
                Help centre
              </a>
            </p>
            <p className="text-lg text-gray-700">
              Otherwise, see all the ways you can speak to our team below.
            </p>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="max-w-xl mx-auto">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] p-8 border border-gray-100">
            {/* Quick Contact Info */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-102 transition-all duration-300 cursor-pointer hover:shadow-md group">
                <i className="fa-solid fa-phone text-[#ff4857] text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                <p className="text-gray-800 font-medium text-sm">+20 123 456 7890</p>
              </div>
              <div className="bg-gray-50/80 backdrop-blur-sm rounded-xl p-4 text-center transform hover:scale-102 transition-all duration-300 cursor-pointer hover:shadow-md group">
                <i className="fa-solid fa-envelope text-[#ff4857] text-2xl mb-2 group-hover:scale-110 transition-transform"></i>
                <p className="text-gray-800 font-medium text-sm">info@gymifyy.com</p>
              </div>
            </div>

            {/* Form Status Message */}
            {submitStatus.message && (
              <div 
                className={`mb-6 p-4 rounded-xl ${
                  submitStatus.type === 'success' 
                    ? 'bg-green-50 text-green-800 border border-green-200' 
                    : 'bg-red-50 text-red-800 border border-red-200'
                } transform transition-all duration-300 hover:scale-[1.01]`}
              >
                <div className="flex items-center justify-center text-sm">
                  <span className="flex-shrink-0 mr-2 text-lg">
                    {submitStatus.type === 'success' ? (
                      <i className="fas fa-check-circle"></i>
                    ) : (
                      <i className="fas fa-exclamation-circle"></i>
                    )}
                  </span>
                  {submitStatus.message}
                </div>
              </div>
            )}

            {/* Contact Form */}
            <form onSubmit={formik.handleSubmit} className="space-y-4">
              <div className="group">
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-user text-gray-400 text-sm"></i>
                  </div>
                  <input
                    type="text"
                    id="name"
                    {...formik.getFieldProps('name')}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#ff4857] focus:border-transparent transition-all duration-300 hover:border-gray-200 text-sm"
                    placeholder="Your name"
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {formik.errors.name}
                  </p>
                )}
              </div>

              <div className="group">
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-envelope text-gray-400 text-sm"></i>
                  </div>
                  <input
                    type="email"
                    id="email"
                    {...formik.getFieldProps('email')}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#ff4857] focus:border-transparent transition-all duration-300 hover:border-gray-200 text-sm"
                    placeholder="your@email.com"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <div className="group">
                <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Message
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="fas fa-comment text-gray-400 text-sm"></i>
                  </div>
                  <textarea
                    id="message"
                    rows="4"
                    {...formik.getFieldProps('message')}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-[#ff4857] focus:border-transparent transition-all duration-300 hover:border-gray-200 resize-none text-sm"
                    placeholder="How can we help you?"
                  ></textarea>
                </div>
                {formik.touched.message && formik.errors.message && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center">
                    <i className="fas fa-exclamation-circle mr-1.5"></i>
                    {formik.errors.message}
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#ff4857] text-white py-2.5 px-6 rounded-lg text-sm font-semibold hover:bg-[#ff3345] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ff4857] disabled:opacity-50 transform hover:scale-102 hover:shadow-md group"
                  disabled={!formik.isValid || formik.isSubmitting}
                >
                  {formik.isSubmitting ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      Send Message
                      <i className="fas fa-paper-plane ml-2 text-xs group-hover:translate-x-1 transition-transform"></i>
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => formik.resetForm()}
                  className="flex-1 bg-[#ffb404] text-white py-2.5 px-6 rounded-lg text-sm font-semibold hover:bg-[#ffa300] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ffb404] transform hover:scale-102 hover:shadow-md group"
                >
                  <span className="flex items-center justify-center">
                    Reset Form
                    <i className="fas fa-redo-alt ml-2 text-xs group-hover:rotate-180 transition-transform"></i>
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
} 