import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Failure from '../components/Failure';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';


const CategoryPlaylists = () => {
  const { categoryId } = useParams();
  const [playlists, setPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylistsAndName();
  }, [categoryId]);

  const fetchPlaylistsAndName = async () => {
    try {
      setHasError(false);
      setIsLoading(true);

      const playlistsRes = await fetch(`https://apis2.ccbp.in/spotify-clone/category-playlists/${categoryId}`);
      if (!playlistsRes.ok) throw new Error('Failed to fetch playlists');
      const playlistsData = await playlistsRes.json();
      setPlaylists(playlistsData.playlists?.items || []);

      const categoriesRes = await fetch(`https://apis2.ccbp.in/spotify-clone/categories`);
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesRes.json();
      const category = categoriesData.categories?.items?.find(cat => cat.id === categoryId);
      setCategoryName(category?.name || categoryId);
    } catch (err) {
      console.error('Error fetching:', err);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white flex-col space-y-2">
        <img src="https://res.cloudinary.com/dkny5wde0/image/upload/v1751691529/Vector_gypeti.png" alt="Loading" className="w-18 h-10 animate-pulse" />
        <h2 className="text-lg font-semibold tracking-wide">Loading...</h2>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex bg-black min-h-screen text-white">
        {/* Sidebar for md+ devices */}
        <div className="hidden md:block">
          <Sidebar />
        </div>
        {/* Sidebar at top for mobile */}
        <div className="block md:hidden">
          <Sidebar />
        </div>
        <div className="md:pl-20 w-full p-6">
          <Failure
            title="Error loading playlists"
            message="Unable to load playlists for this category. Please try again."
            onRetry={fetchPlaylistsAndName}
          />
        </div>
      </div>
    );
  }

   const handleLogout = () => {
    Cookies.remove('jwt_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };


  return (
    <div className="flex flex-col md:flex-row bg-[#1e1e1e] text-white min-h-screen">
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
      <div className="md:pl-20 w-full px-4 sm:px-6 lg:px-12 py-8 overflow-x-hidden">
        {/* Back Button */}
        <button
          className="text-lg font-medium text-gray-300 hover:text-white mb-4 pl-12 sm:pl-14 lg:pl-18"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>

        {/* Heading */}
        <h1 className="text-2xl sm:text-3xl font-bold mb-8 pl-12 sm:pl-14 lg:pl-18">
          {categoryName} Playlists
        </h1>

        {playlists.length === 0 ? (
          <p className="text-gray-400 text-center mt-12">No playlists available in this category.</p>
        ) : (
          <div className="grid gap-x-6 gap-y-8 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 pl-4 sm:pl-6 lg:pl-10">
            {playlists.map((playlist) => {
              if (!playlist) {
                return (
                  <div key={Math.random()} className="p-4 bg-[#2a2a2a] rounded-lg flex flex-col items-center justify-center h-48 text-center text-sm text-gray-400">
                    <span>Unavailable</span>
                    <span className="text-xs text-gray-500 mt-1">Playlist data missing</span>
                  </div>
                );
              }

              const imageUrl = playlist.images?.[0]?.url;
              return (
                <div
                  key={playlist.id}
                  className="cursor-pointer p-4 hover:bg-[#2a2a2a] rounded-lg transition-all"
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  {imageUrl ? (
                    <img src={imageUrl} alt={playlist.name} className="w-full h-40 object-cover rounded-lg shadow-md" />
                  ) : (
                    <div className="w-full h-32 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-white text-center">
                      No Image
                    </div>
                  )}
                  <p className="text-sm mt-2 truncate">{playlist.name}</p>
                  <p className="text-xs text-gray-400">{playlist.tracks?.total ?? 0} Tracks</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPlaylists;
