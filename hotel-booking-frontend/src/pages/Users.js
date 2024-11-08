import React, { useState, useEffect } from 'react';
import client from '../axios';
import { getUsers } from '../api';

const Users = () => {
  
  const [users, setUsers] = useState([]);
  
  // Funzione per recuperare la lista delle prenotazioni
  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Recupera gli utenti quando il componente viene montato
  useEffect(() => {
    fetchUsers();
  }, []);

  const changeUserStatus = async (userId, is_superuser) => {
    try {
      await client.patch(`/api/users/${userId}/`, {
        is_superuser: !is_superuser,
      });
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Utenti</h1>
      {/* Lista degli utenti */}
      {users.length === 0 ? (
        <p className="text-gray-600">Nessun Utente.</p>
      ) : (
        <div className="space-y-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="p-6 bg-white shadow-md rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{user.email}</h2>
                <p className="text-gray-700">Nome: {user.first_name}</p>
                <p className="text-gray-700">Cognome: {user.last_name}</p>
                <p className="text-gray-700">Amministratore: {user.is_superuser ? "si" : "no"}</p>
              </div>
              <div className="flex space-x-4">
                  {user.is_superuser ? (
                    <button
                      onClick={() => changeUserStatus(user.id, user.is_superuser)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Retrocedi
                    </button>
                  ) : (
                    <button
                      onClick={() => changeUserStatus(user.id, user.is_superuser)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Promuovi
                    </button>
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Users;
