import React from 'react';

const Failure = ({ title = "Something went wrong", message = "Please try again.", onRetry }) => {
  return (
    <div className="w-full bg-black text-white rounded-lg p-6 flex flex-col items-center justify-center h-64 sm:h-72">
      <img
        src="https://res.cloudinary.com/dkny5wde0/image/upload/v1752209694/failure_icon_cbdg9o.png"
        alt="Failure"
        className="w-12 h-12 mb-4"
      />
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="text-sm text-gray-400 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="px-4 py-1 bg-white text-black text-sm font-medium rounded hover:bg-gray-200"
      >
        Try Again
      </button>
    </div>
  );
};

export default Failure;
