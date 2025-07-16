import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Sidebar />
      <div className="pl-20 h-screen overflow-hidden bg-black text-white flex flex-col">
        {/* Header with Back button */}
        <div className="flex items-center h-16 px-6 border-b border-gray-700">
          <button
            onClick={() => navigate(-1)}
            className="text-white text-base hover:text-gray-300 transition-all"
            aria-label="Go back"
          >
            ← Back
          </button>
        </div>

        {/* 404 Content */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-4">
          <img
            className="w-52 md:w-72 lg:w-80 mb-6"
            src="https://res.cloudinary.com/dkny5wde0/image/upload/v1752209694/404_x2eo3i.png"
            alt="404 Page Not Found"
          />
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Oops! Page Not Found</h1>
          <p className="text-gray-400 text-sm md:text-base">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2 bg-white text-black font-medium rounded hover:bg-gray-200 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </>
  );
};

export default NotFound;
