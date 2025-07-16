import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const GenresAndMoods = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('https://apis2.ccbp.in/spotify-clone/categories');
        const data = await res.json();
        console.log('Categories API Response:', data);
        setCategories(data.categories);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <div className="flex flex-col md:flex-row bg-black min-h-screen text-white">
      {/* Sidebar for md+ devices */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Sidebar at top for mobile */}
      <div className="md:hidden fixed top-0 left-0 w-full h-14 bg-black z-30 flex items-center justify-between px-4 border-b border-zinc-800">
        <img
          src="https://res.cloudinary.com/dkny5wde0/image/upload/v1751691529/Vector_gypeti.png"
          alt="Logo"
          className="w-12 h-6 sm:w-16 sm:h-8 cursor-pointer"
          onClick={() => navigate('/')}
        />
        <button onClick={handleLogout} className="text-white text-xl hover:text-red-500 transition flex items-center justify-center w-10 h-10">
          <FiLogOut />
        </button>
      </div>
      <div className="md:pl-20 w-full p-4 sm:p-6 overflow-x-hidden">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">Genres & Moods</h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="cursor-pointer rounded-lg p-3 hover:scale-105 transition transform duration-200"
              style={{
                backgroundColor: category.background_color || '#2a2a2a',
              }}
              onClick={() => navigate(`/category/${category.id}`)}
            >
              <p className="font-semibold mb-2 text-sm sm:text-base truncate">{category.name}</p>
              <img
                src={category.icons[0].url}
                alt={category.name}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GenresAndMoods;
