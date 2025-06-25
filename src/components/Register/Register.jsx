import { useState, useEffect } from 'react';
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import backgroundImage from '../../assets/images/img1.jpg';

export default function Register() {
  const [userType, setUserType] = useState('');
  const [errorMessage, setError] = useState(null);
  const [files, setFiles] = useState({
    certificatePhoto: null,
    idPhoto: null,
    profilePhoto: null
  });
  const navg = useNavigate();

  const validYup = Yup.object({
    name: Yup.string()
      .required('name is required')
      .min(2, 'Min 2 characters'),
    email: Yup.string()
      .required('Email is required')
      .email('Enter a valid email'),
    password: Yup.string()
      .required("password required")
      .matches(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, "password invalid"),
    role: Yup.string().required('Role is required'),
    specialization: Yup.string().when('role', {
      is: 'trainer',
      then: (schema) => schema.required('Specialization is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    certificatePhoto: Yup.mixed().when('role', {
      is: 'trainer',
      then: (schema) => schema.required('Certificate photo is required'),
      otherwise: (schema) => schema.notRequired()
    }),
    idPhoto: Yup.mixed().when('role', {
      is: 'trainer',
      then: (schema) => schema.required('ID photo is required'),
      otherwise: (schema) => schema.notRequired()
    }),
  });

  const initialValues = {
    name: "",
    email: '',
    password: '',
    role: '',
    specialization: '',
    certificatePhoto: '',
    idPhoto: '',
    profilePhoto: ''
  };

  const registerForm = useFormik({
    initialValues,
    validationSchema: validYup,
    onSubmit: registerApi,
    enableReinitialize: true
  });

  useEffect(() => {
    if (userType) {
      const newValues = {
        ...initialValues,
        role: userType === 'admin' ? 'admin' : ''
      };
      registerForm.resetForm({ values: newValues });
    }
  }, [userType]);

  const handleFileChange = (e) => {
    const file = e.currentTarget.files[0];
    const fieldName = e.target.name;
    
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));
      registerForm.setFieldValue(fieldName, file.name);
    }
  };

  function registerApi(values) {
    setError(null);
    console.log('Form values before submission:', values); // Debug log

    const url =
      values.role === 'admin'
        ? 'http://localhost:3000/api/v1/auth/register/admin'
        : 'http://localhost:3000/api/v1/auth/register';

    // Create FormData object for file upload
    const formData = new FormData();
    
    // Append all form values
    Object.keys(values).forEach(key => {
      if (key !== 'certificatePhoto' && key !== 'idPhoto' && key !== 'profilePhoto') {
        formData.append(key, values[key]);
      }
    });

    // Append files if they exist
    if (files.certificatePhoto) {
      formData.append('certificatePhoto', files.certificatePhoto);
    }
    if (files.idPhoto) {
      formData.append('idPhoto', files.idPhoto);
    }
    if (files.profilePhoto) {
      formData.append('profilePhoto', files.profilePhoto);
    }

    // Log the data being sent
    console.log('Sending data:', Object.fromEntries(formData));

    axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
      .then(response => {
        console.log('Registration response:', response); // Debug log
        if (response.status === 201) {
          if (values.role === 'admin') {
            navg('/admin');
          } else {
            navg('/login');
          }
        }
      })
      .catch(err => {
        console.error('Registration error:', err);

        if (err.response) {
          console.error('Error response:', err.response);
          console.error('Error data:', err.response.data);
          console.error('Full error details:', JSON.stringify(err.response.data, null, 2));

          if (err.response.data.errors && Array.isArray(err.response.data.errors)) {
            const errorMessages = err.response.data.errors;
            console.log('Validation errors:', errorMessages);
            setError(errorMessages.join('\n'));
          } else if (err.response.data.message) {
            setError(err.response.data.message);
          } else {
            setError("Invalid input or user already exists");
          }
        } else if (err.request) {
          setError("Network error. Please check your connection.");
        } else {
          setError("An unexpected error occurred.");
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
      {/* Dark overlay */}
      {/* <div 
        className="absolute inset-0"
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
      ></div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
          Create your account
        </h2>
      </div> */}

      {!userType && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <h2 className="my-4 text-center text-3xl pb-5">
              Create your account
            </h2>
            <div className="space-y-4">
              <button 
                onClick={() => setUserType('admin')} 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FAB113] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857]"
              >
                Register as Admin
              </button>
              <button 
                onClick={() => setUserType('user')} 
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FD4857] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857]"
              >
                Register as Client/Trainer
              </button>
            </div>
          </div>
        </div>
      )}

      {userType && (
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={registerForm.handleSubmit}>
              <h2 className="my-4 text-center text-3xl pb-5">Create your account</h2>
              {['name', 'email', 'password'].map((field) => (
                <div key={field}>
                  <label htmlFor={field} className="block text-sm font-medium text-gray-700">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <div className="mt-1">
                    <input
                      id={field}
                      name={field}
                      type={field === 'password' ? 'password' : 'text'}
                      value={registerForm.values[field]}
                      onChange={registerForm.handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {registerForm.touched[field] && registerForm.errors[field] && (
                      <div className="text-red-500 text-xs">{registerForm.errors[field]}</div>
                    )}
                  </div>
                </div>
              ))}

              {userType === 'user' && (
                <div>
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <div className="mt-1">
                    <select
                      id="role"
                      name="role"
                      value={registerForm.values.role}
                      onChange={registerForm.handleChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                      <option value="">Select a role</option>
                      <option value="client">Client</option>
                      <option value="trainer">Trainer/Nutritionist</option>
                    </select>
                    {registerForm.touched.role && registerForm.errors.role && (
                      <div className="text-red-500 text-xs">{registerForm.errors.role}</div>
                    )}
                  </div>
                </div>
              )}

              {registerForm.values.role === 'trainer' && (
                <>
                  <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700">
                      specialization
                    </label>
                    <div className="mt-1">
                      <select
                        id="specialization"
                        name="specialization"
                        value={registerForm.values.specialization}
                        onChange={registerForm.handleChange}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      >
                        <option value="">Select a specialization</option>
                        <option value="fitness trainer">fitness trainer</option>
                        <option value="nutritionist">nutritionist</option>
                      </select>
                      {registerForm.touched.specialization && registerForm.errors.specialization && (
                        <div className="text-red-500 text-xs">{registerForm.errors.specialization}</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="certificatePhoto" className="block text-sm font-medium text-gray-700">
                      Certificate Photo
                    </label>
                    <input
                      id="certificatePhoto"
                      name="certificatePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {registerForm.touched.certificatePhoto && registerForm.errors.certificatePhoto && (
                      <div className="text-red-500 text-xs">{registerForm.errors.certificatePhoto}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="idPhoto" className="block text-sm font-medium text-gray-700">
                      ID Photo
                    </label>
                    <input
                      id="idPhoto"
                      name="idPhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {registerForm.touched.idPhoto && registerForm.errors.idPhoto && (
                      <div className="text-red-500 text-xs">{registerForm.errors.idPhoto}</div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
                      Profile Photo
                    </label>
                    <input
                      id="profilePhoto"
                      name="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              )}

              {errorMessage && (
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                  <div className="bg-red-50 p-4 rounded-md">
                    <div className="text-sm text-red-700 whitespace-pre-line">
                      {errorMessage}
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button 
                  type="submit" 
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#FD4857] to-[#FAB113] hover:from-[#e6414e] hover:to-[#e19f11] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857]"
                >
                  Register
                </button>
              </div>

              <div className="mt-4">
                <button 
                  onClick={() => {
                    setUserType('');
                    registerForm.resetForm();
                  }} 
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FD4857]"
                >
                  Back to User Type Selection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
