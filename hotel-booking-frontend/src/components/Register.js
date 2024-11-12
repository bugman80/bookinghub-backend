import React, { useState } from 'react';
import client from '../axios';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Funzione per la registrazione di un nuovo utente
  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await client.post('/api/register/', {
        username,
        email,
        first_name,
        last_name,
        password,
      });

      // Utente creato con successo
      if (response.status === 201) {
        setSuccess(true);
        setError(null);
        setUsername('');
        setEmail('');
        setFirstName('');
        setLastName('');
        setPassword('');
      }
    } catch (error) {
      if (error.response) {
        // Errore ricevuto dalla risposta del server
        setError(error.response.data.detail || "Errore nella registrazione.");
      } else {
        // Errore generico di rete
        setError("Errore nella registrazione. Riprova più tardi.");
      }
    }
  };

  return (
    <>
      <h2 className="text-2xl font-semibold text-center text-gray-800">Registrazione</h2>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {success && <p className="text-sm text-green-500">Registrazione avvenuta con successo! Ora puoi accedere.</p>}
      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            title="Per favore, inserisci un indirizzo email valido."
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Nome:</label>
          <input
            type="text"
            value={first_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Cognome:</label>
          <input
            type="text"
            value={last_name}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3 py-2 mt-1 text-gray-800 border rounded-md focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Registrati
        </button>
      </form>
    </>
  );
}

export default Register;
