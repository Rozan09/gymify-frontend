import React, { useContext, useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../Context/AuthContextProvider';
import { NotificationContext } from '../Context/NotificationContextProvider';
import logo from '../../assets/images/Gymifyy.png';
import { jwtDecode } from 'jwt-decode';

export default function Navbar() {
  const { token, logout: authLogout } = useAuth();
  const { unreadCount } = useContext(NotificationContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const navTextColor = isHome ? 'text-white' : 'text-[#1D202A]';
  const navTextColorHover = 'hover:text-[#FF4857]';
  const [showDropdown, setShowDropdown] = useState(false);
  const [showTrainersMenu, setShowTrainersMenu] = useState(false);
  const [userName, setUserName] = useState('');
  
  // Get current trainer page type
  const getCurrentTrainerPage = () => {
    if (location.pathname === '/trainers/fitness') return 'Fitness Trainers';
    if (location.pathname === '/trainers/nutrition') return 'Nutritionists';
    if (location.pathname === '/trainers') return 'All Trainers';
    return 'Select Trainers';
  };
  
  // Update user info whenever token changes
  useEffect(() => {
    const getUserInfo = () => {
      if (!token) return;

      try {
        // Get user info from token
        const decodedToken = jwtDecode(token);
        
        // Get user info from localStorage
        const userData = localStorage.getItem('userData');
        const parsedUserData = userData ? JSON.parse(userData) : null;

        // Get the full name from registration data
        const firstName = decodedToken?.firstName || parsedUserData?.firstName || '';
        const lastName = decodedToken?.lastName || parsedUserData?.lastName || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        console.log('User full name:', fullName); // Debug log
        setUserName(fullName || decodedToken?.email?.split('@')[0] || '');
      } catch (error) {
        console.error('Error getting user info:', error);
      }
    };

    getUserInfo();
  }, [token]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.trainers-dropdown')) {
        setShowTrainersMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const userRole = token ? jwtDecode(token).role : null;
  const userFirstLetter = userName ? userName.trim().charAt(0).toUpperCase() : 'U';

  function handleLogout() {
    authLogout();
    navigate('/login');
  }

  const trainerOptions = [
    { label: 'Select Trainers', path: '', disabled: true },
    { label: 'All Trainers', path: '/trainers' },
    { label: 'Fitness Trainers', path: '/trainers/fitness' },
    { label: 'Nutritionists', path: '/trainers/nutrition' }
  ];

  return (
    <nav
      className={`absolute w-full z-50 transition-colors duration-300 ${
        isHome ? 'bg-transparent' : 'bg-white backdrop-blur-md shadow'
      }`}
    >
      <div className="max-w-screen-xl flex items-center justify-between mx-auto px-4 py-2">
        {/* Left side: Logo and Navigation */}
        <div className="flex items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center mr-8">
            <img src={logo} className="h-13" alt="Gymify Logo" />
          </Link>

          {/* Navigation Links - Only visible when logged in */}
          {token && (
            <ul className="flex items-center space-x-5">
              <li>
                <NavLink to="/" className={(x) => x.isActive ? "text-[#FF4857]" : `${navTextColor} ${navTextColorHover} transition-colors`}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/Articles" className={(x) => x.isActive ? "text-[#FF4857]" : `${navTextColor} ${navTextColorHover} transition-colors`}>
                  Articles
                </NavLink>
              </li>
              {userRole === 'trainer' && (
                <li>
                  <NavLink to="/TIB" className={(x) => x.isActive ? "text-[#FF4857]" : `${navTextColor} ${navTextColorHover} transition-colors`}>
                    My Bundles
                  </NavLink>
                </li>
              )}
              {userRole !== 'trainer' && (
                <li className="relative trainers-dropdown">
                  <button
                    onClick={() => setShowTrainersMenu(!showTrainersMenu)}
                    className={`appearance-none bg-transparent rounded-lg py-2 ${navTextColor} ${navTextColorHover} transition-colors cursor-pointer min-w-[140px] text-left relative`}
                  >
                    {getCurrentTrainerPage()}
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg 
                        className={`w-5 h-5 ${navTextColor} transition-transform duration-200 ${showTrainersMenu ? 'rotate-180' : ''}`}
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showTrainersMenu && (
                    <div className={`absolute left-0 mt-1 w-full ${isHome ? 'bg-gray-900/95' : 'bg-white'} rounded-lg shadow-lg z-50`}>
                      <button
                        onClick={() => {
                          navigate('/trainers');
                          setShowTrainersMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 ${navTextColor} ${navTextColorHover} hover:bg-gray-800 transition-colors ${location.pathname === '/trainers' ? 'text-[#FF4857] bg-gray-800' : ''}`}
                      >
                        <i className={`fas fa-users mr-2 w-4 $text-white hover:text-${navTextColor} `}></i>
                        All Trainers
                      </button>
                      <button
                        onClick={() => {
                          navigate('/trainers/fitness');
                          setShowTrainersMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 ${navTextColor} ${navTextColorHover} hover:bg-gray-800 transition-colors ${location.pathname === '/trainers/fitness' ? 'text-[#FF4857] bg-gray-800' : ''}`}
                      >
                        <i className={`fas fa-dumbbell mr-2 w-5 $text-white hover:text-${navTextColor}`}></i>
                        Fitness Trainers
                      </button>
                      <button
                        onClick={() => {
                          navigate('/trainers/nutrition');
                          setShowTrainersMenu(false);
                        }}
                        className={`w-full text-left px-3 py-2 ${navTextColor} ${navTextColorHover} hover:bg-gray-800 transition-colors ${location.pathname === '/trainers/nutrition' ? 'text-[#FF4857] bg-gray-800' : ''}`}
                      >
                        <i className={`fas fa-apple-alt mr-2 w-4 $text-white hover:text-${navTextColor}`}></i>
                         Nutritionists
                      </button>
                    </div>
                  )}
                </li>
              )}
              <li>
                <NavLink to="/Contact" className={(x) => x.isActive ? "text-[#FF4857]" : `${navTextColor} ${navTextColorHover} transition-colors`}>
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink to="/Products" className={(x) => x.isActive ? "text-[#FF4857]" : `${navTextColor} ${navTextColorHover} transition-colors`}>
                  Shop
                </NavLink>
              </li>
            </ul>
          )}
        </div>

        {/* Right Side Items */}
        <div className="flex items-center space-x-6">
          {/* Social Icons - Always visible */}
          <div className="flex items-center space-x-4">
            <a href="https://facebook.com/gymify" target="_blank" rel="noopener noreferrer" className={`${navTextColor} ${navTextColorHover} transition-colors`}>
              <i className="fa-brands fa-facebook text-l"></i>
            </a>
            <a href="https://twitter.com/gymify" target="_blank" rel="noopener noreferrer" className={`${navTextColor} ${navTextColorHover} transition-colors`}>
              <i className="fa-brands fa-twitter text-l"></i>
            </a>
            <a href="https://instagram.com/gymify" target="_blank" rel="noopener noreferrer" className={`${navTextColor} ${navTextColorHover} transition-colors`}>
              <i className="fa-brands fa-instagram text-l"></i>
            </a>
            <a href="https://youtube.com/gymify" target="_blank" rel="noopener noreferrer" className={`${navTextColor} ${navTextColorHover} transition-colors`}>
              <i className="fa-brands fa-youtube text-l"></i>
            </a>
          </div>

          {/* User Profile or Auth Buttons */}
          {token ? (
            <div className="flex items-center space-x-4">
              {/* Notification Icon */}
              <Link to="/notifications" className={`relative ${navTextColor} ${navTextColorHover}`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-[#FF4857] rounded-full">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setShowDropdown(!showDropdown)} 
                  className="flex items-center focus:outline-none"
                  title={userName || 'User Profile'}
                >
                  <div className="w-7 h-7 rounded-full bg-[#FF4857] flex items-center justify-center text-white text-lg font-semibold">
                    {userFirstLetter}
                  </div>
                </button>
                {showDropdown && (
                  <div className={`absolute right-0 mt-2 py-2 w-48 ${isHome ? 'bg-gray-900/95' : 'bg-white'} rounded-lg shadow-xl z-20`}>
                    <div className={`px-4 py-2 text-sm ${isHome ? 'text-white/70' : 'text-[#1D202A]/70'}`}>
                      Signed in as<br />
                      <span className={`font-medium ${isHome ? 'text-white' : 'text-[#1D202A]'}`}>{userName || 'User'}</span>
                    </div>
                    <div className="group group-hover:text-white">
                    <Link to="/profile" className={`block px-4 py-2 ${isHome ? 'text-white' : 'group-hover:text-white text-[#1D202A]'} hover:bg-gray-800`} onClick={() => setShowDropdown(false)}>
                      <i className={`fas fa-user mr-2 ${isHome ? 'text-white' : 'hover:text-white text-[#1D202A]'}`}></i>Profile
                    </Link></div>
                    <button onClick={() => { handleLogout(); setShowDropdown(false); }} className={`w-full text-left block px-4 py-2 ${isHome ? 'text-white' : 'hover:text-white text-[#1D202A]'} hover:bg-gray-800`}>
                      <i className={`fas fa-sign-out-alt mr-2 ${isHome ? 'text-white' : 'hover:text-white text-[#1D202A]'}`}></i>Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink to="/login" className={`${navTextColor} ${navTextColorHover} transition-colors`}>
                Login
              </NavLink>
              <NavLink to="/register" className={`${navTextColor} ${navTextColorHover} transition-colors`}>
                Register
              </NavLink>
              </div>
          )}
        </div>
      </div>
    </nav>
  );
}