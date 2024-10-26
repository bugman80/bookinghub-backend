import React, { useRef, useState, useEffect } from 'react';
import client from '../axios';
import { getHotels, getServices } from '../api';

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
  const [rooms, setRooms] = useState(0);
  const [price, setPrice] = useState(0);
  const [selectedServices, setSelectedServices] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [active, setActive] = useState(false);

  const is_superuser = localStorage.getItem('access').is_superuser;
  console.log

  const fetchHotels = async () => {
    try {
      const data = await getHotels();
      setHotels(data);
    } catch (error) {
      console.error('Error fetching hotels:', error);
    }
  };

  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleServiceChange = (e) => {
    const serviceId = parseInt(e.target.value);
    if (e.target.checked) {
      setSelectedServices([...selectedServices, serviceId]);
    } else {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    }
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]); // Setta la nuova immagine selezionata
  };

  const handleActiveChange = (e) => {
    setActive(e.target.checked);
  };

  // Recupera gli hotel quando il componente viene montato
  useEffect(() => {
    fetchHotels();
    fetchServices();
  }, []);

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

  // Funzione per creare un nuovo hotel
  const createHotel = async () => {
    try {
      const formData = populateForm();
      const response = await client.post('/api/hotels/', formData);
      setHotels([...hotels, response.data]); // Aggiungi l'hotel alla lista
      cleanForm();
    } catch (error) {
      console.error('Error creating hotel:', error);
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
    setRooms(hotel.total_rooms || 0);
    setPrice(hotel.price_per_night || 0);
    setSelectedServices(hotel.services || []);
    setImageUrl(hotel.image);
    setActive(hotel.is_active);
    setIsEditing(true);
  };

  

  // Funzione per aggiornare un hotel esistente
  const updateHotel = async () => {
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
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Hotels</h1>
      {is_superuser && (
      <div className="mb-6 p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Hotel' : 'Add New Hotel'}</h2>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Hotel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Rooms"
            value={rooms}
            onChange={(e) => setRooms(e.target.value)}
            className="border p-2 w-full"
          />
          <input
            type="number"
            placeholder="Price per night"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 w-full"
          />
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
              <label className="block text-sm font-medium text-gray-700">Current Hotel Image</label>
              <img
                src={imageUrl}
                alt="Hotel"
                className="w-64 h-40 object-cover rounded-md shadow-md"
              />
            </div>
          )}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload New Image</label>
            <input
              type="file"
              ref={fileInputRef}
              name="image"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900 cursor-pointer focus:outline-none"
            />
          </div>
          <div className="space-y-2">
              <input
                type="checkbox"
                id="active"
                checked={active}
                onChange={handleActiveChange}
                className="mr-2"
              />
              <label htmlFor="active" className="text-gray-700">Active</label>
          </div>
          <button
            onClick={isEditing ? updateHotel : createHotel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update Hotel' : 'Create Hotel'}
          </button>
        </div>
      </div>
      )}
      {/* Lista degli hotel */}
      {hotels.length === 0 ? (
        <p className="text-gray-600">No hotels available.</p>
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
                <p className="text-gray-700">Phone: {hotel.phone_number}</p>
                <p className="text-gray-700">Email: {hotel.email}</p>
                <p className="text-gray-700">Services: {hotel.services.map(id => services.find(service => service.id === id)).filter(service => service).map(service => service.name).join(', ')}</p>
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
              <div className="flex space-x-4">
                <button
                  onClick={() => startEditHotel(hotel)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteHotel(hotel.id)}
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

export default Hotels;
