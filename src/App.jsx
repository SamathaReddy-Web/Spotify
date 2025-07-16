import React from 'react'
import { Toaster } from 'react-hot-toast';
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import Playlist from './components/Playlist'
import AlbumDetails from './components/AlbumDetails';
import CategoryPlaylists from './components/CategoryPlaylists';
import GenresAndMoods from './components/GenresAndMoods';
import NotFound from './components/NotFound';
import Failure from './components/Failure';
import LikedSongs from './components/LikedSongs'


const App = () => {
  return (
    <Routes>
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<Home/>} />
        <Route path="/playlist/:playlistId" element={<Playlist/>} />
        <Route path="/album/:albumId" element={<AlbumDetails />} />
        <Route path="/category/:categoryId" element={<CategoryPlaylists />} />
        <Route path="/genres" element={<GenresAndMoods />} />
        <Route path="*" element={<NotFound />} />
        <Route path="failure" element={<Failure />} />
        <Route path="/liked" element={<LikedSongs />} />
    </Routes>
  )
}
export default App

