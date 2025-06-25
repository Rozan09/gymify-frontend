import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  if (!orderData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-500">No order data provided.</h2>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => navigate('/orders')}
          >
            Go Back to Orders
          </button>
        </div>
      </div>
    );
  }

const handleProceedToPayment = () => {
  navigate('/pay', { state: { orderData } });
};




  return (
    <div className="max-w-2xl mx-auto pt-30 py-10 px-4">
      <h1 className="text-3xl font-bold mb-6">Payment for Order #{orderData.id}</h1>

      <div className="space-y-4">
        {orderData.items.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b pb-2">
            <div>
              <h2 className="font-semibold">{item.product.name}</h2>
              <p className="text-gray-500">
                Quantity: {item.quantity} × ${item.product.price.toFixed(2)}
              </p>
            </div>
            <p className="font-bold">${item.totalPrice.toFixed(2)}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right">
        <p className="text-xl font-bold">
          Total: ${orderData.total.toFixed(2)}
        </p>
        <button
          onClick={handleProceedToPayment}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Proceed to Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
