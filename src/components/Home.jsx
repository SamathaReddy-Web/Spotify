import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Fuse from 'fuse.js';
import Sidebar from '../components/Sidebar';
import Failure from '../components/Failure';
import { FiLogOut, FiSearch, FiSettings, FiBell } from 'react-icons/fi';
import toast, { Toaster } from 'react-hot-toast';
import SectionWithToggle from '../components/SectionWithToggle';


const Home = () => {
  const navigate = useNavigate();
  const [featuredPlaylists, setFeaturedPlaylists] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newReleases, setNewReleases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState('editors');
  const [searchQuery, setSearchQuery] = useState('');
  const [userName, setUserName] = useState('Rahul');
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const jwtToken = Cookies.get('jwt_token');
    const name = Cookies.get('user_name') || 'User';
    setUserName(name);
    if (!jwtToken) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setHasError(false);

      const [featuredRes, categoriesRes, newReleasesRes] = await Promise.all([
        fetch('https://apis2.ccbp.in/spotify-clone/featured-playlists'),
        fetch('https://apis2.ccbp.in/spotify-clone/categories'),
        fetch('https://apis2.ccbp.in/spotify-clone/new-releases'),
      ]);

      if (!featuredRes.ok || !categoriesRes.ok || !newReleasesRes.ok) {
        throw new Error('API call failed');
      }

      const featuredData = await featuredRes.json();
      const categoriesData = await categoriesRes.json();
      const newReleasesData = await newReleasesRes.json();

      setFeaturedPlaylists(featuredData.playlists);
      setCategories(categoriesData.categories);
      setNewReleases(newReleasesData.albums);
    } catch (error) {
      console.error('Failed to load data:', error);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Cookies.remove('jwt_token');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const scrollToSection = (tab) => {
  setActiveTab(tab);
  const element = document.getElementById(`${tab}-section`);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};


  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const fuse = new Fuse([
    ...(featuredPlaylists.items || []).map(item => ({ ...item, type: 'playlist' })),
    ...(categories.items || []).map(item => ({ ...item, type: 'category' })),
    ...(newReleases.items || []).map(item => ({ ...item, type: 'album' })),
  ], {
    keys: ['name'],
    threshold: 0.4,
  });

  const filteredResults = searchQuery
    ? fuse.search(searchQuery).map(res => res.item)
    : null;

  const MobileTabs = ({onTabClick}) => (
    <div className="flex md:hidden justify-around px-4 mt-4 space-x-2">
      {['editors', 'genres', 'releases'].map((tab) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-full font-medium text-sm mb-4 ${
            activeTab === tab ? 'bg-green-500 text-black' : 'bg-zinc-800 text-white'
          }`}
          onClick={() =>onTabClick(tab)}
        >
          {{
            editors: "Editor's Picks",
            genres: 'Genres & Moods',
            releases: 'New Releases',
          }[tab]}
        </button>
      ))}
    </div>
  );

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
        <div className="hidden md:block w-64">
          <Sidebar />
        </div>
        <div className="flex-1 p-6">
          <Failure title="Home failure" message="Something went wrong. Please try again." onRetry={fetchData} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex bg-black min-h-screen text-white relative">
      {/* Sidebar for md+ */}
      <div className="hidden md:block sticky h-full bg-black ">
        <Sidebar />
      </div>

      {/* Top Bar */}
      <div className="fixed top-0 left-0 w-full h-14 bg-black z-30 flex items-center justify-between px-4 md:hidden border-b border-zinc-800">
        <img src="https://res.cloudinary.com/dkny5wde0/image/upload/v1751691529/Vector_gypeti.png" alt="Logo" className="w-12 h-6 sm:w-15 sm:h-8 mt-4 mb-4" />
        <button onClick={handleLogout} className="text-white text-xl hover:text-red-500 transition w-10 h-6 mb-4 sm:w-15 sm:h-8 mt-4">
          <FiLogOut />
        </button>
      </div>

      {/* Main Content */}
      <div className="mt-10 md:ml-28 md:mr-12 w-full min-h-screen bg-black text-white overflow-y-auto px-4">
        {/* Greeting & Search */}
        <h1 className="text-2xl font-semibold my-4">{getGreeting()}, {userName} 👋</h1>
        {/* Search Bar Section */}
        <div className="flex items-center justify-between flex-wrap mb-6">
        {/* Centered Search Bar */}
        <div className="flex-1 flex justify-center order-2 md:order-1">
          <div className="relative w-full max-w-md">
            <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 rounded-full bg-[#2c2c2c] text-md text-white placeholder-zinc-400 
                        focus:outline-none focus:ring-2 transition duration-200"
              placeholder="Search for playlists, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-4 ml-4 order-3 md:order-2">
          {/* Settings */}
          <button
            className="p-2 hover:bg-zinc-800 rounded-full transition hidden md:block"
            onClick={() => toast('Settings are under construction 🔧')}
          >
            <FiSettings className="text-zinc-400 hover:text-white w-5 h-5" />
          </button>

          {/* Notification */}
          <button
            className="p-2 hover:bg-zinc-800 rounded-full transition relative"
            onClick={() => toast('No new notifications 📭')}
          >
            <FiBell className="text-zinc-400 hover:text-white w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Avatar */}
          <div className="relative hidden md:block">
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            className="focus:outline-none"
          >
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxoVYK9gVqDWkfv3blKuxWEO0t9JrH6XSjxg&s"
              alt="User"
              className="w-8 h-8 rounded-full object-cover border border-zinc-700 hover:border-white transition"
            />
          </button>

          {/* Dropdown menu */}
          {showProfileMenu && (
          <div
            className="absolute right-0 mt-2 w-40 bg-[#2a2a2a] rounded-md shadow-lg py-2 z-50"
            tabIndex={0}
            onBlur={() => setShowProfileMenu(false)}
            onMouseLeave={() => setShowProfileMenu(false)}
          >
            <button
              className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
            >
              Name : Rahul
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-800 hover:text-white"
            >
              Logout
            </button>
          </div>
        )}
        </div>

        </div>
        </div>

          
        {/* Mobile Tabs */}
        <MobileTabs onTabClick={scrollToSection} />

        {/* Search Results */}
        {searchQuery && (
          <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
        {filteredResults.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (item.type === 'playlist') navigate(`/playlist/${item.id}`);
              else if (item.type === 'album') navigate(`/album/${item.id}`);
              else if (item.type === 'category') navigate(`/category/${item.id}`);
            }}
            className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.05] hover:shadow-xl"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square overflow-hidden rounded-xl">
              <img
                src={item.images?.[0]?.url || item.icons?.[0]?.url}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />

              {/* Type Label */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded capitalize z-10">
                {item.type || 'playlist'}
              </div>
            </div>

            {/* Name */}
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
      </div>
        )}

        {/* Desktop Sections */}
        {!searchQuery && (
          <>
            <div className="hidden md:block">
              <SectionWithToggle title="Editor's Picks" data={featuredPlaylists.items} type="playlist" />
              <SectionWithToggle title="Genres & Moods" data={categories.items} type="category" />
              <SectionWithToggle title="New Releases" data={newReleases.items} type="album" />
            </div>

            {/* Mobile Sections */}
            <div className="md:hidden">
              <div id="editors-section">
                <SectionWithToggle
                  title="Editor's Picks"
                  data={featuredPlaylists.items?.slice(0, 20)}
                  type="playlist"
                />
              </div>
              <div id="genres-section">
                <SectionWithToggle
                  title="Genres & Moods"
                  data={categories.items?.slice(0, 20)}
                  type="category"
                />
              </div>
              <div id="releases-section">
                <SectionWithToggle
                  title="New Releases"
                  data={newReleases.items?.slice(0, 20)}
                  type="album"
                />
              </div>
            </div>
          </>
        )}

        {/* Trigger toast on some event like scroll or click */}
        <button
          onClick={() => toast.success('Enjoy your personalized picks!')}
          className="hidden"
        >
          Notify
        </button>
      </div>
      <Toaster />
    </div>
  );
};

const Section = ({ title, data, type }) => {
  const navigate = useNavigate();
  const handleClick = (item) => {
    if (type === 'playlist') navigate(`/playlist/${item.id}`);
    else if (type === 'category') navigate(`/category/${item.id}`);
    else if (type === 'album') navigate(`/album/${item.id}`);
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 py-6 sm:py-8 mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-white">{title}</h2>
        <p className="text-green-500 text-lg sm:text-base font-semibold cursor-pointer hover:text-green-400 active:scale-120
             transition-all duration-200 ease-in-out">
          See All
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {data?.map((item) => (
          <div
            key={item.id}
            onClick={() => handleClick(item)}
            className="bg-zinc-900 rounded-xl overflow-hidden cursor-pointer hover:bg-zinc-800 transition shadow-sm hover:shadow-md"
          >
            {/* Image Container */}
            <div className="relative w-full aspect-square">
              <img
                src={type === 'category' ? item.icons?.[0]?.url : item.images?.[0]?.url}
                alt={item.name}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Language Label */}
              <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                {item.language || type === 'category' ? 'Category' : 'Playlist'}
              </div>
            </div>

            {/* Title */}
            <div className="p-3">
              <p className="text-sm font-medium text-white truncate">{item.name}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
