import React, { useEffect, useState } from 'react';
import { getHotels } from '../api'; // Importa la funzione API

const HotelList = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupero la lista degli hotels
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const data = await getHotels();
        setHotels(data);
        setLoading(false);
      } catch (err) {
        setError('Errore durante il caricamento degli hotel');
        setLoading(false);
      }
    };

    fetchHotels();
  }, []);

  if (loading) {
    return <div className="text-center py-5">Caricamento...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-5">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 text-center">Lista degli Hotel</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map(hotel => (
          <li key={hotel.id} className="bg-white shadow-md rounded-lg p-4">
            <h2 className="text-xl font-semibold">{hotel.name}</h2>
            <p className="text-gray-700">
              {hotel.city}, {hotel.country}
            </p>
            <p className="text-blue-500 mt-2">
              {hotel.total_rooms} Camere | {hotel.price_per_night} € a notte
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HotelList;
