// src/components/SearchBar.jsx
import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';
import Fuse from 'fuse.js';

const SearchBar = ({ data, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    return JSON.parse(localStorage.getItem('recentSearches')) || [];
  });

  const fuse = new Fuse(data, {
    keys: ['name'],
    threshold: 0.4,
  });

  const filteredResults = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : [];

  const handleSelect = (item) => {
    onSelect(item);
    setSearchQuery(item.name);
    updateRecent(item);
    setIsFocused(false);
  };

  const updateRecent = (item) => {
    const updated = [item, ...recentSearches.filter((i) => i.id !== item.id)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  const clearRecents = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  return (
    <div className="relative w-full max-w-md">
      {/* Input */}
      <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400 w-4 h-4" />
      <input
        type="text"
        className="w-full pl-10 pr-4 py-2 rounded-full bg-zinc-900 text-sm text-white placeholder-zinc-400 
                  focus:outline-none focus:ring-2 focus:ring-green-500 transition"
        placeholder="Search for playlists, artists..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
      />

      {/* Dropdown */}
      {isFocused && (
        <div className="absolute z-50 mt-2 w-full bg-zinc-800 rounded-md shadow-lg max-h-64 overflow-y-auto">
          {searchQuery ? (
            filteredResults.length > 0 ? (
              filteredResults.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                >
                  <img src={item.images?.[0]?.url || item.icons?.[0]?.url} className="w-10 h-10 rounded" />
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-zinc-400 text-xs truncate">{item.description}</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-zinc-400 px-4 py-2 text-sm">No results found</p>
            )
          ) : (
            <>
              <p className="px-4 py-2 text-sm font-semibold text-white">Recent searches</p>
              {recentSearches.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-center gap-3 px-4 py-2 hover:bg-zinc-700 cursor-pointer"
                >
                  <img src={item.images?.[0]?.url || item.icons?.[0]?.url} className="w-10 h-10 rounded" />
                  <div>
                    <p className="text-white text-sm font-medium">{item.name}</p>
                    {item.description && (
                      <p className="text-zinc-400 text-xs truncate">{item.description}</p>
                    )}
                  </div>
                </div>
              ))}
              {recentSearches.length > 0 && (
                <div className="px-4 py-2">
                  <button
                    onClick={clearRecents}
                    className="w-full py-1 px-3 text-sm border border-zinc-500 text-white rounded-full hover:bg-zinc-700"
                  >
                    Clear recent searches
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
