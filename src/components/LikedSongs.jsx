import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useLikedSongs } from '../context/LikedSongsContext';


const LikedSongs = () => {
  const navigate = useNavigate();
  const { likedTracks, toggleLike, isLiked } = useLikedSongs();
  const [currentTrack, setCurrentTrack] = useState(null);

  // useEffect(() => {
  //   const storedTracks = localStorage.getItem('likedTracks');
  //   if (storedTracks) {
  //     setLikedTracks(JSON.parse(storedTracks));
  //   }
  // }, []);

  // useEffect(() => {
  //   localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
  // }, [likedTracks]);

  // const toggleLike = (track) => {
  //   const exists = likedTracks.some((t) => t.id === track.id);
  //   if (exists) {
  //     setLikedTracks((prev) => prev.filter((t) => t.id !== track.id));
  //   } else {
  //     setLikedTracks((prev) => [...prev, track]);
  //   }
  // };

  // const isLiked = (track) => likedTracks.some((t) => t.id === track.id);

  return (
    <>
      <Sidebar />
      <div className="pl-20 w-full min-h-screen bg-[#1e1e1e] text-white px-4 sm:px-8 py-8 overflow-x-hidden pb-32">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <button
            className="text-lg sm:text-xl font-semibold text-gray-300 hover:text-white"
            onClick={() => navigate(-1)}
          >
            ← Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-right w-full sm:w-auto">Liked Songs</h1>
        </div>

        {/* Table Wrapper for responsiveness */}
        {likedTracks.length === 0 ? (
          <p className="text-center text-gray-400 mt-20 text-lg">
            You haven’t liked any songs yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-md table-auto min-w-[700px]">
              <thead className="text-white border-b border-gray-600">
                <tr>
                  <th className="py-3 font-normal w-12 pl-6 sm:pl-10">#</th>
                  <th className="py-3 font-normal w-1/3 pl-4">Track</th>
                  <th className="py-3 font-normal w-1/4 pl-4">Album</th>
                  <th className="py-3 font-normal w-20 pl-4">Time</th>
                  <th className="py-3 font-normal w-1/5 pl-4">Artist</th>
                  <th className="py-3 font-normal w-16 text-center">Like</th>
                </tr>
              </thead>
              <tbody>
                {likedTracks.map((track, idx) => {
                  const time = new Date(track.duration_ms).toISOString().substr(14, 5);
                  return (
                    <tr
                      key={track.id}
                      className={`border-b border-gray-800 hover:bg-gray-800 transition duration-150 cursor-pointer ${
                        currentTrack?.id === track.id ? 'bg-gray-800' : ''
                      }`}
                      onClick={() => {
                        if (track.preview_url) {
                          setCurrentTrack(track);
                        } else {
                          alert('Preview not available for this track.');
                        }
                      }}
                    >
                      <td className="py-4 pl-6 sm:pl-10">{idx + 1}</td>
                      <td className="py-4 pl-4 truncate">{track.name}</td>
                      <td className="py-4 pl-4 truncate">{track.album?.name}</td>
                      <td className="py-4 pl-4">{time}</td>
                      <td className="py-4 pl-4 truncate">{track.artists?.[0]?.name}</td>
                      <td
                        className="py-4 text-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(track);
                        }}
                      >
                        {isLiked(track) ? (
                          <FaHeart className="text-pink-500 text-lg mx-auto" />
                        ) : (
                          <FaRegHeart className="text-white text-lg hover:text-pink-400 mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Audio Player */}
        {currentTrack && (
          <div className="fixed bottom-0 left-20 right-0 bg-[#181818] border-t border-gray-700 text-white px-4 sm:px-8 py-3 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
            <div className="flex items-center gap-4 min-w-[200px]">
              <img
                src={currentTrack.album.images?.[0]?.url}
                alt="cover"
                className="w-12 h-12 object-cover rounded"
              />
              <div className="leading-tight">
                <p className="font-semibold text-sm">{currentTrack.name}</p>
                <p className="text-xs text-gray-400">{currentTrack.artists?.[0]?.name}</p>
              </div>
            </div>
            <div className="flex-1 w-full sm:w-auto flex justify-center">
              {currentTrack.preview_url ? (
                <audio
                  controls
                  autoPlay
                  src={currentTrack.preview_url}
                  className="w-full sm:w-[400px] accent-green-500"
                />
              ) : (
                <p className="text-sm text-gray-400">Preview not available</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LikedSongs;
