import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SectionWithToggle = ({ title, data = [], type }) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Number of items to show initially
  const initialItemsCount = isSmallScreen ? 5 : 9;
  const visibleItems = showAll ? data : data.slice(0, initialItemsCount);

  const handleClick = (item) => {
    if (type === 'playlist') navigate(`/playlist/${item.id}`);
    else if (type === 'category') navigate(`/category/${item.id}`);
    else if (type === 'album') navigate(`/album/${item.id}`);
  };

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4 px-2 md:px-0">
        <h2 className="text-xl md:text-2xl font-semibold">{title}</h2>
        {data.length > initialItemsCount && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-green-500 text-lg sm:text-base font-semibold cursor-pointer hover:text-green-400 active:scale-120
             transition-all duration-200 ease-in-out"
          >
            {showAll ? 'Show Less' : 'See All'}
          </button>
        )}
      </div>

      <div className={`grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 px-2 md:px-0`}>
        {visibleItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className="cursor-pointer rounded-lg bg-zinc-900 hover:bg-zinc-800 transition transform hover:scale-105"
          >
            {isSmallScreen ? (
              <div className="w-full h-40 overflow-hidden rounded-md">
                <img
                  src={type === 'category' ? item.icons?.[0]?.url : item.images?.[0]?.url}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-t-md"
                />
              </div>
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg">
                <img
                  src={type === 'category' ? item.icons?.[0]?.url : item.images?.[0]?.url}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-2 text-center">
              <p className="text-sm font-medium text-white truncate">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWithToggle;
