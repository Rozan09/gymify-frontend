import React from "react";
import { useNavigate } from "react-router-dom";

export default function Pay() {
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    // Optionally you can add logic here for validation or showing confirmation
    navigate('/');
  };

  return (
    <div className="min-h-screen pt-30 bg-gray-100 p-4 flex justify-center items-center">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Checkout Form */}
        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold mb-2">Secure Checkout</h2>
          <p className="text-sm text-gray-600 mb-4">Choose your preferred payment method</p>

          {/* Payment Methods */}
          <div className="flex space-x-4 mb-4">
            <div className="border rounded p-2 flex items-center justify-center w-16 h-12 bg-blue-100 border-blue-500">💳</div>
            <div className="border rounded p-2 flex items-center justify-center w-16 h-12">💰</div>
            <div className="border rounded p-2 flex items-center justify-center w-16 h-12">🏦</div>
            <div className="border rounded p-2 flex items-center justify-center w-16 h-12">📤</div>
          </div>

          {/* Card Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Cardholder Name</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="Test" />
            </div>

            <div>
              <label className="block text-sm font-medium">Card Number</label>
              <input type="text" className="w-full border rounded px-3 py-2" placeholder="**** **** **** 1111" />
            </div>

            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium">Expiry Date</label>
                <input type="text" className="w-full border rounded px-3 py-2" placeholder="12 / 29" />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium">CVV2</label>
                <input type="text" className="w-full border rounded px-3 py-2" placeholder="CVV2" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-blue-600 cursor-pointer">Billing Details</label>
              <label className="block text-sm font-medium">E-mail</label>
              <input type="email" className="w-full border rounded px-3 py-2" placeholder="E-mail" />
            </div>

            <div>
              <label className="block text-sm font-medium">Country</label>
              <select className="w-full border rounded px-3 py-2">
                <option>Egypt</option>
                <option>United Kingdom</option>
                <option>United States</option>
                <option>Germany</option>
                <option>France</option>
              </select>
            </div>

            <button
              onClick={handlePlaceOrder}
              className="mt-4 w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Place Order
            </button>

            <div className="text-center mt-2">
              <a href="#" className="text-blue-600 text-sm">Go Back</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
