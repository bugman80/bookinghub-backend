import React, { useState } from 'react';
import client from '../axios';
import { useNavigate } from 'react-router-dom';
import Register from './Register';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [showRegister, setShowRegister] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleShowRegister = () => {
    setShowRegister(true);
  };

  const handleShowLogin = () => {
    setShowRegister(false);
  };

  // Funzione per settare le credenziali utente
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  // Funzione per inviare i dati di accesso e recuperare i tokens
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await client.post('/api/token/', credentials);
      localStorage.setItem('access', response.data.access);
      localStorage.setItem('refresh', response.data.refresh);
      // Reindirizza l'utente alla homepage
      navigate('/');
    } catch (err) {
      setError('Invalid username or password');
    }
  };

  return (
    <>
      {showRegister ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
          <Register />
          <button
            onClick={handleShowLogin}
            className="w-full mt-4 text-blue-500 hover:underline"
          >
            Torna al Login
          </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-1/3">
            <h2 className="text-2xl font-semibold text-center text-gray-800">Entra</h2>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                required
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="border rounded w-full py-2 px-3"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white rounded w-full py-2 hover:bg-blue-600"
            >
              Invia
            </button>
            <button
              onClick={handleShowRegister}
              className="w-full mt-4 text-blue-500 hover:underline"
            >
              Non hai un account? Registrati
            </button>
          </form>
          </div>
      )}
    </>
  );
};

export default Login;
