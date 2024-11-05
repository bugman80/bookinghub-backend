import React, { useState, useEffect } from 'react';
import client from '../axios';
import { getBookings, getHotels, getUserData } from '../api';

const Bookings = () => {
  const clean_form = { hotel: '', check_in: '', check_out: '', guests: '', total_price: 0 };

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]); // Lista di hotel per il dropdown
  const [bookingForm, setBookingForm] = useState(clean_form);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookingId, setEditBookingId] = useState(null);
  const [errors, setErrors] = useState({});

  const is_superuser = getUserData().superuser;

  // Funzione per recuperare la lista delle prenotazioni
  const fetchBookings = async () => {
    try {
      const data = await getBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Funzione per recuperare la lista degli hotels
  const fetchHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  // Recupera bookings e hotels quando il componente viene montato
  useEffect(() => {
    fetchBookings();
    fetchHotels();
  }, []);

  // Funzione per validare il form prima dell'invio
  const validate = () => {
    const errors = {};

    if (!bookingForm.hotel) {
      errors.hotel = 'Hotel obbligatorio';
    }
    if (!bookingForm.check_in) {
      errors.check_in = 'Check-in obbligatorio';
    }
    if (!bookingForm.check_out) {
      errors.check_out = 'Check-out obbligatorio';
    }
    if (!bookingForm.guests) {
      errors.guests = 'Numero ospiti obbligatorio';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Funzione per creare una nuova prenotazione
  const createBooking = async () => {
    if(validate()){
      try {
        const response = await client.post('/api/bookings/', bookingForm);
        setBookings([...bookings, response.data]); // Aggiungi la nuova prenotazione alla lista
        setBookingForm(clean_form); // Reset del form
      } catch (error) {
        setErrors(error.response.data);
      }
    }
  };

  // Funzione per eliminare una prenotazione
  const deleteBooking = async (bookingId) => {
    try {
      await client.delete(`/api/bookings/${bookingId}/`);
      setBookings(bookings.filter((booking) => booking.id !== bookingId)); // Rimuovi la prenotazione dalla lista
    } catch (error) {
      console.error('Error deleting booking:', error);
    }
  };

  // Funzione per approvare una prenotazione
  const changeBookingStatus = async (bookingId, status) => {
    try {
      await client.patch(`/api/bookings/${bookingId}/update_status/`, {
        status: status,
      });
      fetchBookings();
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  // Funzione per avviare la modifica di una prenotazione
  const startEditBooking = (booking) => {
    setBookingForm({
      hotel: booking.hotel,
      check_in: booking.check_in,
      check_out: booking.check_out,
      guests: booking.guests,
      total_price: 0,
    });
    setIsEditing(true);
    setEditBookingId(booking.id);
  };

  // Funzione per aggiornare una prenotazione esistente
  const updateBooking = async () => {
    if(validate()){
      try {
        const response = await client.put(`/api/bookings/${editBookingId}/`, bookingForm);
        setBookings(bookings.map((booking) => (booking.id === editBookingId ? response.data : booking))); // Aggiorna la lista
        setBookingForm(clean_form); // Reset del form
        setIsEditing(false); // Esci dalla modalità di modifica
        setEditBookingId(null);
      } catch (error) {
        console.error('Error updating booking:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Prenotazioni</h1>

      <div className="mb-6 p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">{isEditing ? 'Modifica Prenotazione' : 'Aggiungi Prenotazione'}</h2>
        <div className="space-y-4 mt-4">
          <select
            data-testid="hotel-select"
            value={bookingForm.hotel}
            onChange={(e) => setBookingForm({ ...bookingForm, hotel: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Scegli l'Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          {errors.hotel && <p style={{ color: 'red' }}>{errors.hotel}</p>}
          <input
            type="date"
            placeholder="Data di Arrivo"
            value={bookingForm.check_in}
            onChange={(e) => setBookingForm({ ...bookingForm, check_in: e.target.value })}
            className="border p-2 w-full"
          />
          {errors.check_in && <p style={{ color: 'red' }}>{errors.check_in}</p>}
          <input
            type="date"
            placeholder="Data di Partenza"
            value={bookingForm.check_out}
            onChange={(e) => setBookingForm({ ...bookingForm, check_out: e.target.value })}
            className="border p-2 w-full"
          />
          {errors.check_out && <p style={{ color: 'red' }}>{errors.check_out}</p>}
          <input
            type="number"
            placeholder="Numero di Ospiti"
            value={bookingForm.guests}
            onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
            className="border p-2 w-full"
          />
          {errors.guests && <p style={{ color: 'red' }}>{errors.guests}</p>}
          <button
            onClick={isEditing ? updateBooking : createBooking}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Modifica' : 'Aggiungi'}
          </button>
        </div>
      </div>

      {/* Lista delle prenotazioni */}
      {bookings.length === 0 ? (
        <p className="text-gray-600">Nessuna Prenotazione.</p>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-6 bg-white shadow-md rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{hotels.find(hotel => hotel.id === booking.hotel) && hotels.find(hotel => hotel.id === booking.hotel).name}</h2>
                <p className="text-gray-700">
                  Arrivo: {booking.check_in} | Partenza: {booking.check_out}
                </p>
                <p className="text-gray-700">Ospiti: {booking.guests}</p>
                <p className="text-gray-700">Prezzo: {booking.total_price}</p>
                <p className="text-gray-700">Stato: {booking.status}</p>
              </div>
              <div className="flex space-x-4">
                {booking.status==="pending" && (
                  <>
                  {is_superuser && (
                    <>
                      <button
                        onClick={() => changeBookingStatus(booking.id, 'approved')}
                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      >
                        Approva
                      </button>
                      <button
                        onClick={() => changeBookingStatus(booking.id, 'rejected')}
                        className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                      >
                        Rigetta
                      </button>
                    </>
                  )}
                  <>
                    <button
                      onClick={() => startEditBooking(booking)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Modifica
                    </button>
                    <button
                      onClick={() => deleteBooking(booking.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Elimina
                    </button>
                  </>
                </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
