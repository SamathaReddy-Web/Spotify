// src/pages/Playlist.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import SearchAndLike from '../components/SearchAndLike';
import { FiLogOut } from 'react-icons/fi';
import Cookies from 'js-cookie';
import toast from 'react-hot-toast';

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [likedTracks, setLikedTracks] = useState([]);
  const [showLiked, setShowLiked] = useState(false);
  const [addedTimestamps, setAddedTimestamps] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchPlaylistDetails();
  }, [playlistId]);

  const fetchPlaylistDetails = async () => {
    try {
      const res = await fetch(`https://apis2.ccbp.in/spotify-clone/playlists-details/${playlistId}`);
      const data = await res.json();
      setPlaylist(data);

      const timestamps = {};
      data.tracks.items.forEach(item => {
        const trackId = item.track.id;
        timestamps[trackId] = Math.floor(Math.random() * 12 + 1) + ' Months ago';
      });
      setAddedTimestamps(timestamps);
    } catch (error) {
      console.error('Failed to load playlist details:', error);
    }
  };

  const toggleLike = (track) => {
    setLikedTracks(prev => {
      const isLiked = prev.some(t => t.id === track.id);
      return isLiked ? prev.filter(t => t.id !== track.id) : [...prev, track];
    });
  };

  const isLiked = (track) => likedTracks.some(t => t.id === track.id);

  if (!playlist) {
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

  const { name, images, description, tracks } = playlist;

  const originalItems = tracks.items.map(item => item.track);
  const filteredItems = (showLiked ? likedTracks : originalItems).filter(track =>
    track.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <>
      <div className="hidden md:block">
        <Sidebar />
      </div>
      {/* Mobile Header */}
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

      <div className="md:ml-16 w-full min-h-screen bg-[#1e1e1e] text-white px-4 sm:px-6 lg:px-12 py-8 mt-14 md:mt-0 overflow-x-hidden">
        {/* Header Row: Back + Search + Like */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <button
            className="text-lg sm:text-xl font-semibold text-gray-300 hover:text-white flex items-center"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <div className="w-full md:w-auto flex-1 md:flex-none">
            <SearchAndLike
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              showLiked={showLiked}
              setShowLiked={setShowLiked}
            />
          </div>
        </div>

        {/* Playlist Info */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-10 mb-10 items-center md:items-start">
          <img
            src={images[0].url}
            alt="Playlist"
            className="w-44 h-44 md:w-60 md:h-60 object-cover rounded-lg shadow-xl"
          />
          <div className="flex flex-col justify-end text-center md:text-left">
            <p className="text-md text-white mb-2 font-semibold">Editor's picks</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-1">{name}</h1>
            <p className="text-sm md:text-base text-white mt-3">{description}</p>
          </div>
        </div>

        {/* Songs Table */}
        <div className="hidden md:block overflow-x-auto m-3">
          <table className="w-full table-fixed text-left text-md">
            <thead className="text-white border-b border-gray-600">
              <tr>
                <th className="py-3 pl-4 w-10 font-normal">#</th>
                <th className="py-3 px-2 w-1/4 font-normal">Track</th>
                <th className="py-3 px-2 w-1/4 font-normal">Album</th>
                <th className="py-3 px-2 w-20 font-normal">Time</th>
                <th className="py-3 px-2 w-1/5 font-normal">Artist</th>
                <th className="py-3 px-2 w-28 font-normal">Added</th>
                <th className="py-3 px-2 w-10 font-normal">Like</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center text-gray-400 py-6">No matching songs found.</td>
                </tr>
              ) : (
                filteredItems.map((track, idx) => {
                  const time = new Date(track.duration_ms).toISOString().substr(14, 5);
                  const added = addedTimestamps[track.id] || 'Recently added';

                  return (
                    <tr
                      key={track.id}
                      className={`border-b border-gray-800 hover:bg-gray-800 transition cursor-pointer ${currentSong?.id === track.id ? "bg-gray-800" : ""}`}
                      onClick={() => {
                        if (track.preview_url) {
                          setCurrentSong(track);
                        } else {
                          toast.error('Preview not available for this track.');
                        }
                      }}
                    >
                      <td className="py-3 pl-4 text-gray-400">{idx + 1}</td>
                      <td className="py-3 px-2 truncate max-w-[180px]">{track.name}</td>
                      <td className="py-3 px-2 truncate max-w-[160px]">{track.album?.name}</td>
                      <td className="py-3 px-2">{time}</td>
                      <td className="py-3 px-2 truncate max-w-[120px]">{track.artists?.[0]?.name}</td>
                      <td className="py-3 px-2">{added}</td>
                      <td
                        className="py-3 px-2 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track);
                        }}
                      >
                        {isLiked(track) ? (
                          <FaHeart className="text-pink-500 text-lg" />
                        ) : (
                          <FaRegHeart className="text-white text-lg hover:text-pink-400" />
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile List */}
        <div className="md:hidden space-y-4">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-400 py-4">No matching songs found.</p>
          ) : (
            filteredItems.map((track, idx) => {
              const time = new Date(track.duration_ms).toISOString().substr(14, 5);
              const added = addedTimestamps[track.id] || 'Recently added';
              return (
                <div
                  key={track.id}
                  className={`p-4 bg-[#2a2a2a] rounded-md cursor-pointer ${currentSong?.id === track.id ? "bg-gray-800" : ""}`}
                  onClick={() => {
                    if (track.preview_url) {
                      setCurrentSong(track);
                    } else {
                      alert('Preview not available for this track.');
                    }
                  }}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-base font-semibold">{track.name}</h3>
                      <p className="text-sm text-gray-400">{track.artists?.[0]?.name}</p>
                      <p className="text-xs text-gray-400">{track.album?.name}</p>
                      <p className="text-xs text-gray-500">{added} • {time}</p>
                    </div>
                    <div onClick={(e) => { e.stopPropagation(); toggleLike(track); }}>
                      {isLiked(track) ? (
                        <FaHeart className="text-pink-500 text-lg" />
                      ) : (
                        <FaRegHeart className="text-white text-lg hover:text-pink-400" />
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Audio Player */}
        {currentSong && (
          <div className="fixed bottom-0 left-0 lg:left-20 right-0 bg-[#181818] border-t border-gray-700 text-white px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between z-50 gap-4 sm:gap-0">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={currentSong.album.images[0].url}
                alt="cover"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="leading-tight">
                <p className="font-semibold text-sm">{currentSong.name}</p>
                <p className="text-xs text-gray-400">{currentSong.artists?.[0]?.name}</p>
              </div>
            </div>
            <div className="flex-1 flex justify-center w-full sm:w-auto">
              {currentSong.preview_url ? (
                <audio
                  controls
                  autoPlay
                  src={currentSong.preview_url}
                  className="w-full max-w-[400px] accent-green-600"
                />
              ) : (
                <p className="text-gray-400 text-sm">Preview not available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Playlist;
