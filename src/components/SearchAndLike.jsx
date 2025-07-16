import React from 'react';
import { FiSearch } from 'react-icons/fi';
import { MdFavorite } from 'react-icons/md';

const SongListHeader = ({ searchTerm, setSearchTerm, showLiked, setShowLiked }) => {
  return (
    <div className="flex flex-row justify-between items-center gap-4 mb-6 w-full md:mr-20">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="What song do you want to play?"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-[#2c2c2c] pl-10 pr-4 py-2 rounded-md text-white outline-none w-full"
        />
      </div>
      {/* Liked Songs Button */}
      <button
        onClick={() => setShowLiked(prev => !prev)}
        className={` text-2xl ${showLiked ? 'text-pink-500' : 'text-white'} hover:text-pink-400 md:mr-10`}
        title="Liked Songs"
      >
        <MdFavorite />
      </button>
    </div>
  );
};

export default SongListHeader;