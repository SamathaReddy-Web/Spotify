import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {      
    const token = Cookies.get('jwt_token');
    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const onSubmitSuccess = (jwtToken) => {
    Cookies.set('jwt_token', jwtToken, { expires: 30 });
    navigate('/', { replace: true });
  };

  const handleLogin = async (e) => {
  e.preventDefault();
  const userDetails = { username, password };

  const isDev = window.location.hostname === 'localhost';
  const baseURL = isDev ? '/apis' : 'https://apis.ccbp.in';
  const url = `${baseURL}/login`;


  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userDetails),
  };
  try {
    const response = await fetch(url, options);
    let data;
    console.log("Login API URL:", url);


    if (response.ok) {
      data = await response.json();
      onSubmitSuccess(data.jwt_token);
    } else {
      data = await response.json();
      setErrorMsg(data.error_msg);
      setUsername('');
      setPassword('');
    }
  } catch (error) {
    console.error('Login failed:', error);
    setErrorMsg('Username or password is incorrect.');
  }
};

  const jwtToken = Cookies.get('jwt_token');
  if (jwtToken !== undefined) {
    return <Navigate to="/" />;
  }

  return (
    <div
      className="w-screen h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: `url('https://res.cloudinary.com/dkny5wde0/image/upload/v1751694149/Spotify_Profile_1_v2qn8a.png')`,
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative bg-black/40 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-xl w-11/12 sm:w-96 text-white">
        <div className="flex justify-center mb-4">
          <img
            src="https://res.cloudinary.com/dkny5wde0/image/upload/v1751691529/Vector_gypeti.png"
            alt="Logo"
            className="w-26 h-12"
          />
        </div>
        <h2 className="text-3xl font-bold mb-6 text-center">Spotify Remix</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block mb-1 text-sm">Username</label>
            <input
              type="text"
              className="w-full px-3 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block mb-1 text-sm">Password</label>
            <input
              type="password"
              className="w-full px-3 py-2 rounded bg-gray-100 text-black border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 transition duration-200 text-white font-semibold py-2 rounded"
          >
            Login
          </button>
        </form>
        {errorMsg && (
          <p className="text-red-400 text-md mt-5 text-center">{errorMsg}</p>
        )}
      </div>
    </div>
  );
};

export default Login;


// 1. useEffect => to check if the user is already logged in via JWT Token
// 2. We are using async as it enables us to use await inside the function, which pauses execution until
//    the promise resolves. Without use of async and await app may break because it tries to use data before it's ready
// 3. JS Object → JSON string (for sending data) JSON.stringify
//    JSON string → JS Object (for reading response) JSON.parse
// 4. The code inside try is attempted. If any error occurs, it jumps to the catch block.
// 5. After saving the token:
//    You’ll send it in every API call via header or let server read from cookie. Backend verifies the token before responding
// 6. In order to make the user enter credentials apart from login page, Use a protected route component to wrap pages that need login
// 7. User details --> React sent to server --> if right, responds with jwt token --> react saves in cookies 