import React, { useEffect, useState } from 'react';
import { getBooking } from '../api'; // Funzione API per ottenere una prenotazione
import { useParams } from 'react-router-dom';

const BookingDetails = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Recupero la lista delle prenotazioni
  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const data = await getBooking(id);
        setBooking(data);
        setLoading(false);
      } catch (err) {
        setError('Errore durante il caricamento della prenotazione');
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return <div className="text-center py-5">Caricamento...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-5">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Dettagli della Prenotazione</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-2">{booking.hotel.name}</h2>
        <p className="text-gray-700">Città: {booking.hotel.city}</p>
        <p className="text-gray-700">Prezzo Totale: {booking.total_price} €</p>
        <p className="text-gray-700">Numero Ospiti: {booking.guests}</p>
        <p className="text-gray-700">Check-in: {booking.check_in}</p>
        <p className="text-gray-700">Check-out: {booking.check_out}</p>
        <p className={`mt-4 ${booking.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}`}>
          Stato: {booking.status === 'confirmed' ? 'Confermata' : 'Non Confermata'}
        </p>
      </div>
    </div>
  );
};

export default BookingDetails;
