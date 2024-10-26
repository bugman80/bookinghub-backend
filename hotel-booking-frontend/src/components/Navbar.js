import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importa Link da React Router
import client from '../axios';
import { getUserData } from '../utils';

const Navbar = () => {
    const location = useLocation(); // Ottieni la route attuale
    const isAuthenticated = !!localStorage.getItem('access');
    const is_superuser = getUserData().superuser;

    const navigate = useNavigate();

    const restart_session = () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      navigate('/login');
    }

    const handleLogout = async () => {
      const access = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');
      console.log(access);
      console.log(refresh);
      if (access && refresh) {
        try {
          await client.post('/api/logout/', {"refresh": refresh});
          restart_session();
        } catch (err) {
          console.error('Logout error:', err);
          restart_session();
        }
      }
    };

    
    return (
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            <Link to="/">MyHotel</Link>
          </div>
          <div className="hidden md:flex space-x-6">
            <Link
              to="/"
              className={`${
                location.pathname === '/' ? 'text-blue-600' : 'text-gray-700'
              } hover:text-blue-600`}
            >
              Home
            </Link>
            {isAuthenticated && (
              <Link
                to="/hotels"
                className={`${
                  location.pathname === '/hotels' ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-600`}
              >
                Hotels
              </Link>
            )}
            {isAuthenticated && is_superuser && (
              <Link
                to="/services"
                className={`${
                  location.pathname === '/services' ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-600`}
              >
                Services
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`${
                  location.pathname === '/bookings' ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-600`}
              >
                Bookings
              </Link>
            )}
            {isAuthenticated ? (
                <Link 
                    to="#"
                    onClick={handleLogout}
                    className={`${
                        location.pathname === '/logout' ? 'text-blue-600' : 'text-gray-700'
                    } hover:text-blue-600`}
                >
                    Logout
                </Link>
            ) : (
                <Link 
                    to="/login" 
                    className={`${
                        location.pathname === '/login' ? 'text-blue-600' : 'text-gray-700'
                    } hover:text-blue-600`}
                >
                    Login
                </Link>
            )}
          </div>
        </div>
      </nav>
    );
};

export default Navbar;
