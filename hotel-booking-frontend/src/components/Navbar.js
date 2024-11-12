import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom'; // Importa Link da React Router
import client from '../axios';
import { getUserData } from '../api';

const Navbar = () => {
    const location = useLocation(); // Ottieni la route attuale
    const isAuthenticated = !!localStorage.getItem('access');
    const is_superuser = null;

    const navigate = useNavigate();

    // Funzione per resettare la sessione utente
    const restart_session = () => {
      localStorage.removeItem('access');
      localStorage.removeItem('refresh');
      navigate('/login');
    }

    try {
      is_superuser = getUserData().superuser;
    } catch (err) {
      console.error('Token error:', err);
      restart_session();
    }

    // Funzione per eseguire il logout dell'utente
    const handleLogout = async () => {
      const access = localStorage.getItem('access');
      const refresh = localStorage.getItem('refresh');
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
            <Link to="/">Prenotiamo</Link>
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
            {isAuthenticated && is_superuser && (
              <Link
              to="/users"
              className={`${
                location.pathname === '/users' ? 'text-blue-600' : 'text-gray-700'
              } hover:text-blue-600`}
              >
                Utenti
              </Link>
            )}
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
                Servizi
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/bookings"
                className={`${
                  location.pathname === '/bookings' ? 'text-blue-600' : 'text-gray-700'
                } hover:text-blue-600`}
              >
                Prenotazioni
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
                    Esci
                </Link>
            ) : (
                <Link 
                    to="/login" 
                    className={`${
                        location.pathname === '/login' ? 'text-blue-600' : 'text-gray-700'
                    } hover:text-blue-600`}
                >
                    Entra
                </Link>
            )}
          </div>
        </div>
      </nav>
    );
};

export default Navbar;
