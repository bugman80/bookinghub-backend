import React, { useState, useEffect } from 'react';
import client from '../axios';

const Bookings = () => {
  const clean_form = { hotel: '', check_in: '', check_out: '', guests: '', total_price: 0 };

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]); // Lista di hotel per il dropdown
  const [bookingForm, setBookingForm] = useState(clean_form);
  const [isEditing, setIsEditing] = useState(false);
  const [editBookingId, setEditBookingId] = useState(null);

  // Funzione per recuperare la lista di bookings
  const fetchBookings = async () => {
    try {
      const response = await client.get('/api/bookings/');
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  // Funzione per recuperare la lista di hotel
  const fetchHotels = async () => {
    try {
      const response = await client.get('/api/hotels/');
      setHotels(response.data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  // Recupera bookings e hotels quando il componente viene montato
  useEffect(() => {
    fetchBookings();
    fetchHotels();
  }, []);

  // Funzione per creare una nuova prenotazione
  const createBooking = async () => {
    try {
      const response = await client.post('/api/bookings/', bookingForm);
      setBookings([...bookings, response.data]); // Aggiungi la nuova prenotazione alla lista
      setBookingForm(clean_form); // Reset del form
    } catch (error) {
      console.error('Error creating booking:', error);
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
    try {
      const response = await client.put(`/api/bookings/${editBookingId}/`, bookingForm);
      setBookings(bookings.map((booking) => (booking.id === editBookingId ? response.data : booking))); // Aggiorna la lista
      setBookingForm(clean_form); // Reset del form
      setIsEditing(false); // Esci dalla modalità di modifica
      setEditBookingId(null);
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Bookings</h1>

      <div className="mb-6 p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Booking' : 'Add New Booking'}</h2>
        <div className="space-y-4 mt-4">
          <select
            value={bookingForm.hotel}
            onChange={(e) => setBookingForm({ ...bookingForm, hotel: e.target.value })}
            className="border p-2 w-full"
          >
            <option value="">Select Hotel</option>
            {hotels.map((hotel) => (
              <option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Check-in Date"
            value={bookingForm.check_in}
            onChange={(e) => setBookingForm({ ...bookingForm, check_in: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="date"
            placeholder="Check-out Date"
            value={bookingForm.check_out}
            onChange={(e) => setBookingForm({ ...bookingForm, check_out: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Guests"
            value={bookingForm.guests}
            onChange={(e) => setBookingForm({ ...bookingForm, guests: e.target.value })}
            className="border p-2 w-full"
          />
          <button
            onClick={isEditing ? updateBooking : createBooking}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update Booking' : 'Create Booking'}
          </button>
        </div>
      </div>

      {/* Lista delle prenotazioni */}
      {bookings.length === 0 ? (
        <p className="text-gray-600">No bookings available.</p>
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
                  Check-in: {booking.check_in} | Check-out: {booking.check_out}
                </p>
                <p className="text-gray-700">Guests: {booking.guests}</p>
                <p className="text-gray-700">Total Price: {booking.total_price}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => startEditBooking(booking)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteBooking(booking.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookings;
