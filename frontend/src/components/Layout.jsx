import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const url = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerified, setIsVerified] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await axios.get(`${url}/auth/getCompany`, {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 200) {
            setUser(response.data.name);
            setIsVerified(response.data.isVerified);
            setEmail(response.data.email);
          } else {
            navigate('/signin');
          }
        } catch (error) {
          console.error(error);
          navigate('/signin');
        }
      } else if (location.pathname !== '/signin' && location.pathname !== '/signup') {
        navigate('/signin'); // Redirect to sign-in if not logged in
      }
    };

    fetchUserData();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (email && !isVerified) {
      navigate(`/verify?email=${email}`);
    }
  }, [isVerified, email, navigate]);


  const handleLogout = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        await axios.post(`${url}/auth/logout`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        localStorage.removeItem('token'); // Remove token from localStorage
        setUser(null); // Clear user state
        navigate('/signin'); // Redirect to sign-in page
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="flex justify-between items-center p-4">
        <Link to="/" className="flex items-center">
          <img
            src="cuvette_logo.png"
            alt="Cuvette Logo"
            width={120}
            height={30}
          />
        </Link>
        <div className="flex items-center gap-4">
          {user ? (
            <span className="text-gray-600">{user}</span> // Display user's name
          ) : (
            <span className="text-gray-600">Guest</span>
          )}
          <div className="relative">
            <button
              className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="User menu"
              aria-haspopup="true"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      <main className="flex-grow flex items-center justify-center px-4">
        {children}
      </main>
    </div>
  );
};

export default Layout;
