// src/pages/MobileListSection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const MobileListSection = ({ title, data = [], type }) => {
  const navigate = useNavigate();

  const handleClick = (item) => {
    if (type === 'playlist') navigate(`/playlist/${item.id}`);
    else if (type === 'category') navigate(`/category/${item.id}`);
    else if (type === 'album') navigate(`/album/${item.id}`);
  };

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4 px-2">
        <h2 className="text-xl font-semibold">{title}</h2>
        <button className="text-sm text-green-400 hover:underline">Show All</button>
      </div>
      <div className="flex overflow-x-auto space-x-4 px-2 scrollbar-hide">
        {data.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className="min-w-[140px] bg-zinc-900 rounded-lg p-2 cursor-pointer hover:bg-zinc-800 transition"
          >
            <img
              src={
                type === 'category'
                  ? item.icons?.[0]?.url
                  : item.images?.[0]?.url
              }
              alt={item.name}
              className="w-full h-40 object-cover rounded-md mb-2"
            />
            <p className="text-sm font-semibold truncate text-white">{item.name}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{type}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MobileListSection;
