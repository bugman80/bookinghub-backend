import client from './axios';

// Imposta l'endpoint API di base
const API_URL = '/api/';

// Funzione per ottenere la lista degli hotel
export const getHotels = async () => {
  try {
    const response = await client.get(`${API_URL}hotels/`);
    return response.data;
  } catch (error) {
    console.error('Errore durante il caricamento degli hotel', error);
    throw error;
  }
};

export const getServices = async () => {
  try {
    const response = await client.get(`${API_URL}services/`);
    return response.data;
  } catch (error) {
    console.error('Errore durante il caricamento dei servizi', error);
    throw error;
  }
};

// Funzione per ottenere una singola prenotazione
export const getBooking = async (id) => {
  try {
    const response = await client.get(`${API_URL}bookings/${id}/`);
    return response.data;
  } catch (error) {
    console.error('Errore durante il caricamento della prenotazione', error);
    throw error;
  }
};

// Funzione per creare una nuova prenotazione
export const createBooking = async (bookingData) => {
  try {
    const response = await client.post(`${API_URL}bookings/`, bookingData);
    return response.data;
  } catch (error) {
    console.error('Errore durante la creazione della prenotazione', error);
    throw error;
  }
};
