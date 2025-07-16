import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NewRelease = () => {
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNewRelease();
  }, []);

  const fetchNewRelease = async () => {
    try {
      setHasError(false);
      const response = await fetch('https://apis2.ccbp.in/spotify-clone/new-releases');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setNewReleases(data.album);
    } catch (error) {
      console.error('Failed to fetch new releases:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white flex-col space-y-2">
        <img
          src="https://res.cloudinary.com/dkny5wde0/image/upload/v1751691529/Vector_gypeti.png"
          alt="Loading"
          className="w-18 h-10 animate-pulse"
        />
        <h2 className="text-lg font-semibold tracking-wide">Loading...</h2>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black text-white flex-col text-center space-y-4 px-4">
        <img
          src="https://res.cloudinary.com/dkny5wde0/image/upload/v1752209694/failure_icon_cbdg9o.png"
          alt="Error"
          className="w-12 h-12"
        />
        <h2 className="text-xl font-semibold">Failed to load new releases</h2>
        <p className="text-sm text-gray-400">Please check your connection or try again later.</p>
        <button
          onClick={fetchNewRelease}
          className="mt-2 px-4 py-1 text-sm bg-white text-black rounded hover:bg-gray-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#0f0f0f] text-white px-4 sm:px-8 md:px-12 py-10">
      <h2 className="text-2xl font-bold mb-6">New Releases</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
        {newReleases.map((album) => (
          <div
            key={album.id}
            className="cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => navigate(`/album/${album.id}`)}
          >
            <img
              src={album.image_url}
              alt={album.name || 'Album cover'}
              loading="lazy"
              className="w-full h-auto rounded-lg shadow-lg object-cover aspect-square"
            />
            <p className="mt-2 text-sm font-medium truncate">{album.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewRelease;
