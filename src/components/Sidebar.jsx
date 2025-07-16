import React from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    navigate('/login');
  };

  const goToHome = () => {
    navigate('/');
  };

  return (
    <div className="w-16 sm:w-20 h-screen bg-black text-white flex flex-col justify-between items-center py-6 border-r border-gray-700 fixed z-50">
      {/* Logo */}
      <div
        className="flex items-center justify-center cursor-pointer"
        onClick={goToHome}
        title="Home"
      >
        <img
          src="https://res.cloudinary.com/dkny5wde0/image/upload/v1751691529/Vector_gypeti.png"
          alt="Logo"
          className="w-10 h-6 sm:w-15 sm:h-8 mt-4"
        />
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="text-white hover:text-red-500 transition flex flex-col items-center justify-center space-y-1 sm:space-y-2"
        title="Logout"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 sm:h-6 sm:w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
          />
        </svg>
        <span className="text-[10px] sm:text-xs font-light tracking-wide mb-6 sm:mb-8">
          Logout
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
