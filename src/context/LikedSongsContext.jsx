import React, { createContext, useContext, useEffect, useState } from 'react';

const LikedSongsContext = createContext();

export const useLikedSongs = () => useContext(LikedSongsContext);

export const LikedSongsProvider = ({ children }) => {
  const [likedTracks, setLikedTracks] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('likedTracks');
    if (stored) setLikedTracks(JSON.parse(stored));
  }, []);

  // Save to localStorage whenever likedTracks changes
  useEffect(() => {
    localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
  }, [likedTracks]);

  // Toggle like/unlike
  const toggleLike = (track) => {
    setLikedTracks(prev => {
      const exists = prev.some(t => t.id === track.id);
      return exists ? prev.filter(t => t.id !== track.id) : [...prev, track];
    });
  };

  // Check if liked
  const isLiked = (track) => likedTracks.some(t => t.id === track.id);

  return (
    <LikedSongsContext.Provider value={{ likedTracks, toggleLike, isLiked }}>
      {children}
    </LikedSongsContext.Provider>
  );
};