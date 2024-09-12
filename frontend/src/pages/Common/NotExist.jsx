import React from 'react';
import { Link } from 'react-router-dom';

function NotExist() {
  return (
    <div className='w-full min-h-screen flex flex-col items-center justify-center bg-gray-800'>
      <h1 className='font-bold text-3xl text-white mb-6 text-center'>
        404 - PAGE NOT FOUND
      </h1>
      <Link to="/">
        <button className='px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-all duration-300'>
          Back to Home
        </button>
      </Link>
    </div>
  );
}

export default NotExist;
