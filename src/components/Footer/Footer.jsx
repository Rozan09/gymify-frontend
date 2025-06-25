import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Gymifyy from '../../assets/images/Gymifyy.png';

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    // Add newsletter subscription logic here
    setEmail('');
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* Brand and Newsletter Section */}
          <div>
            <div className="flex items-center mb-4">
              <img src={Gymifyy} className="h-10" alt="Gymifyy Logo" />
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your ultimate destination for fitness transformation. Join our community today!
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe to our newsletter"
                className="px-3 py-2 text-sm text-gray-900 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#FF4857]"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 text-sm font-medium text-white bg-[#FF4857] rounded-lg hover:bg-[#ff3345] transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-lg font-semibold text-white mb-4">Quick Links</p>
            <nav className="grid grid-cols-2 gap-4 text-sm">
              <Link to="/articles" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                Articles
              </Link>
              <Link to="/trainers" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                Trainers
              </Link>
              <Link to="/shop" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                Shop
              </Link>
              <Link to="/calculators" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                Calculators
              </Link>
              <Link to="/nutrition" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                Nutrition
              </Link>
              <Link to="/programs" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                Programs
              </Link>
            </nav>
          </div>

          {/* Contact and Social */}
          <div>
            <p className="text-lg font-semibold text-white mb-4">Contact Us</p>
            <div className="space-y-2 text-sm text-gray-400 mb-4">
              <p><i className="fa-solid fa-location-dot mr-2 text-[#FF4857]"></i>Cairo, Egypt</p>
              <p><i className="fa-solid fa-phone mr-2 text-[#FF4857]"></i>+20 123 456 7890</p>
              <p><i className="fa-solid fa-envelope mr-2 text-[#FF4857]"></i>info@gymifyy.com</p>
            </div>
            <div className="flex gap-4">
              <a href="/" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                <i className="fa-brands fa-facebook text-xl"></i>
              </a>
              <a href="/" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                <i className="fa-brands fa-instagram text-xl"></i>
              </a>
              <a href="/" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                <i className="fa-brands fa-twitter text-xl"></i>
              </a>
              <a href="/" className="text-gray-400 hover:text-[#FF4857] transition-colors">
                <i className="fa-brands fa-youtube text-xl"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-8 pt-6 border-t border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} Gymifyy. All rights reserved.</p>
            <div className="mt-2 sm:mt-0 flex gap-4">
              <Link to="/privacy" className="hover:text-[#FF4857] transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-[#FF4857] transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}