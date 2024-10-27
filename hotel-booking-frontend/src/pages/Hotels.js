import React, { useRef, useState, useEffect } from 'react';
import client from '../axios';
import { getHotels, getServices, getUserData } from '../api';

const Hotels = () => {

  const fileInputRef = useRef(null);

  const [hotels, setHotels] = useState([]);
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [hotelId, setHotelId] = useState(null);  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [rooms, setRooms] = useState("");
  const [price, setPrice] = useState("");
  const [selectedServices, setSelectedServices] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [active, setActive] = useState(false);
  const [errors, setErrors] = useState({});

  const is_superuser = getUserData().superuser;

  // Carico gli hotels esistenti
  const fetchHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  // Carico i servizi esistenti
  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  // Setta i servizi selezionati
  const handleServiceChange = (e) => {
    const serviceId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  // Setta la nuova immagine selezionata
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Setta l'hotel ad attivo/inattivo
  const handleActiveChange = (e) => {
    setActive(e.target.checked);
  };

  // Recupera gli hotel e i servizi quando il componente viene montato
  useEffect(() => {
    fetchHotels();
    fetchServices();
  }, []);

  // Funzione per resettare il form
  const cleanForm = () => {
    setName("");
    setDescription("");
    setAddress("");
    setPhone("");
    setEmail("");
    setCity("");
    setCountry("");
    setRooms("");
    setPrice("");
    setSelectedServices([]);
    setImage(null);
    setImageUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";  // Clear the actual input value
    }
    setActive(false);
  };

  // Funzione per popolare il form
  const populateForm = () => {
    const formData = new FormData();
    formData.append("id", hotelId);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("phone_number", phone);
    formData.append("email", email);
    formData.append("city", city);
    formData.append("country", country);
    formData.append("total_rooms", rooms);
    formData.append("price_per_night", price);
    selectedServices.forEach((id) => {
      formData.append("services", id);
    });
    image && formData.append("image", image);
    formData.append("is_active", active);
    return formData;
  }

  // Funzione per validare il form
  const validate = () => {
    const errors = {};

    if (!name) {
      errors.name = 'Nome obbligatorio';
    }
    if (!description) {
      errors.description = 'Descrizione obbligatoria';
    }
    if (!address) {
      errors.address = 'Indirizzo obbligatorio';
    }
    if (!phone) {
      errors.phone_number = 'Telefono obbligatorio';
    }
    if (!email) {
      errors.email = 'Email obbligatoria';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email non valida';
    }
    if (!city) {
      errors.city = 'Citta\' obbligatoria';
    }
    if (!country) {
      errors.country = 'Paese obbligatorio';
    }
    if (!rooms) {
      errors.total_rooms = 'Numero di camere obbligatorio';
    }
    if (!price) {
      errors.price_per_night = 'Prezzo per notte obbligatorio';
    }
    if (!image && !imageUrl) {
      errors.image = 'Immagine obbligatoria';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Funzione per creare un nuovo hotel
  const createHotel = async () => {
    if(validate()){
      try {
        const formData = populateForm();
        const response = await client.post('/api/hotels/', formData);
        setHotels([...hotels, response.data]); // Aggiungi l'hotel alla lista
        cleanForm();
      } catch (error) {
        console.error('Error creating hotel:', error);
      }
    }
  };

  // Funzione per eliminare un hotel
  const deleteHotel = async (hotelId) => {
    try {
      await client.delete(`/api/hotels/${hotelId}/`);
      setHotels(hotels.filter((hotel) => hotel.id !== hotelId)); // Rimuovi l'hotel dalla lista
    } catch (error) {
      console.error('Error deleting hotel:', error);
    }
  };

  // Funzione per avviare la modifica di un hotel
  const startEditHotel = (hotel) => {
    setHotelId(hotel.id);
    setName(hotel.name || "");
    setDescription(hotel.description || "");
    setAddress(hotel.address || "");
    setPhone(hotel.phone_number || "");
    setEmail(hotel.email || "");
    setCity(hotel.city || "");
    setCountry(hotel.country || "");
    setRooms(hotel.total_rooms || "");
    setPrice(hotel.price_per_night || "");
    setSelectedServices(hotel.services || []);
    setImageUrl(hotel.image);
    setActive(hotel.is_active);
    setIsEditing(true);
  };

  // Funzione per aggiornare un hotel esistente
  const updateHotel = async () => {
    if(validate()){
      try {
        const formData = populateForm();
        const response = await client.put(`/api/hotels/${hotelId}/`, formData);
        setHotels(hotels.map((hotel) => (hotel.id === hotelId ? response.data : hotel))); // Aggiorna la lista
        setIsEditing(false); // Esci dalla modalità di modifica
        setHotelId(null);
        cleanForm();
      } catch (error) {
        console.error('Error updating hotel:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hotels</h1>
      {is_superuser && (
      <div className="mb-6 p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">{isEditing ? 'Modifica Hotel' : 'Aggiungi Hotel'}</h2>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          <input
            type="text"
            placeholder="Descrizione"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
          <input
            type="text"
            placeholder="Indirizzo"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.address && <p style={{ color: 'red' }}>{errors.address}</p>}
          <input
            type="text"
            placeholder="Telefono"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.phone_number && <p style={{ color: 'red' }}>{errors.phone_number}</p>}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
          <input
            type="text"
            placeholder="Citta'"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.city && <p style={{ color: 'red' }}>{errors.city}</p>}
          <input
            type="text"
            placeholder="Paese"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.country && <p style={{ color: 'red' }}>{errors.country}</p>}
          <input
            type="number"
            placeholder="Numero di Camere"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.total_rooms && <p style={{ color: 'red' }}>{errors.total_rooms}</p>}
          <input
            type="number"
            placeholder="Prezzo per notte"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-full"
          />
          {errors.price_per_night && <p style={{ color: 'red' }}>{errors.price_per_night}</p>}
          {services.map(service => (
            <div key={service.id} className="flex items-center mb-2">
              <input
                type="checkbox"
                id={`service-${service.id}`}
                value={service.id}
                checked={selectedServices.includes(service.id)}
                onChange={handleServiceChange}
                className="mr-2"
              />
              <label htmlFor={`service-${service.id}`} className="text-gray-700">{service.name}</label>
            </div>
          ))}
          {imageUrl && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Immagine dell'Hotel</label>
              <img
                src={imageUrl}
                alt="Hotel"
                className="w-64 h-40 object-cover rounded-md shadow-md"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Seleziona Immagine</label>
            <input
              type="file"
              ref={fileInputRef}
              name="image"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 cursor-pointer focus:outline-none"
            />
          </div>
          {errors.image && <p style={{ color: 'red' }}>{errors.image}</p>}
          <div className="space-y-2">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={handleActiveChange}
                className="mr-2"
              />
              <label htmlFor="active" className="text-gray-700">Attivo</label>
          </div>
          <button
            onClick={isEditing ? updateHotel : createHotel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Modifica' : 'Aggiungi'}
          </button>
        </div>
      </div>
      )}
      {/* Lista degli hotel */}
      {hotels.length === 0 ? (
        <p className="text-gray-600">Nessun Hotel.</p>
      ) : (
        <div className="space-y-6">
          {hotels.map((hotel) => (
            <div
              key={hotel.id}
              className="p-6 bg-white shadow-md rounded-lg flex justify-between items-center"
            >
              <div>
                <h2 className="text-xl font-semibold text-blue-600">{hotel.name}</h2>
                <p className="text-gray-700">{hotel.location}</p>
                <p className="text-gray-700">{hotel.description}</p>
                <p className="text-gray-700">Telefono: {hotel.phone_number}</p>
                <p className="text-gray-700">Email: {hotel.email}</p>
                <p className="text-gray-700">Servizi: {hotel.services.map(id => services.find(service => service.id === id)).filter(service => service).map(service => service.name).join(', ')}</p>
              </div>
              {hotel.image && (
                <div className="flex space-x-4">
                  <img
                    src={hotel.image}
                    alt="Hotel"
                    className="w-64 h-40 object-cover rounded-md shadow-md"
                  />
                </div>
              )}
              {is_superuser && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => startEditHotel(hotel)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Modifica
                  </button>
                  <button
                    onClick={() => deleteHotel(hotel.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Elimina
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Hotels;
