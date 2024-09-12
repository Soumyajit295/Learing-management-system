import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaExclamationCircle } from 'react-icons/fa';

const PaymentFailed = () => {
  const navigate = useNavigate();

  const handleRetry = () => {
    navigate('/courses');
  };

  const handleContactSupport = () => {
    navigate('/support');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-red-900 text-white py-12 px-6">
      <div className="max-w-md mx-auto text-center bg-red-800 p-8 rounded-lg shadow-lg">
        <FaExclamationCircle className="text-6xl mb-4 mx-auto text-red-400" />
        <h1 className="text-3xl font-semibold mb-4">Payment Failed</h1>
        <p className="text-lg mb-6">Unfortunately, your payment could not be processed. Please try again or contact support if the issue persists.</p>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleRetry}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-300"
          >
            Retry Payment
          </button>
          <button
            onClick={handleContactSupport}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailed;
