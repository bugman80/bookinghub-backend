import React, { useState, useEffect } from 'react';
import client from '../axios';
import { getServices } from '../api';

const Services = () => {
  const clean_form = { name: '', description: '' };

  const [services, setServices] = useState([]);
  const [serviceForm, setServiceForm] = useState(clean_form);
  const [isEditing, setIsEditing] = useState(false);
  const [editServiceId, setEditServiceId] = useState(null);
  const [errors, setErrors] = useState({});

  // Funzione per recuperare la lista di services
  const fetchServices = async () => {
    try {
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const validate = () => {
    const errors = {};

    if (!serviceForm.name) {
      errors.name = 'Nome obbligatorio';
    }
    if (!serviceForm.description) {
      errors.description = 'Descrizione obbligatoria';
    }
    
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createService = async () => {
    if(validate()){
      try {
        const response = await client.post('/api/services/', serviceForm);
        setServices([...services, response.data]); // Aggiungi la nuova prenotazione alla lista
        setServiceForm(clean_form); // Reset del form
      } catch (error) {
        console.error('Error creating service:', error);
      }
    }
  };

  const deleteService = async (serviceId) => {
    try {
      await client.delete(`/api/services/${serviceId}/`);
      setServices(services.filter((service) => service.id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const startEditService = (service) => {
    setServiceForm({
      name: service.name,
      description: service.description
    });
    setIsEditing(true);
    setEditServiceId(service.id);
  };

  const updateService = async () => {
    if(validate()){
      try {
        const response = await client.put(`/api/services/${editServiceId}/`, serviceForm);
        setServices(services.map((service) => (service.id === editServiceId ? response.data : service))); // Aggiorna la lista
        setServiceForm(clean_form); // Reset del form
        setIsEditing(false); // Esci dalla modalità di modifica
        setEditServiceId(null);
      } catch (error) {
        console.error('Error updating service:', error);
      }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Services</h1>

      <div className="mb-6 p-6 bg-gray-100 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
        <div className="space-y-4 mt-4">
          <input
            type="text"
            placeholder="Name"
            value={serviceForm.name}
            onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
            className="border p-2 w-full"
          />
          {errors.name && <p style={{ color: 'red' }}>{errors.name}</p>}
          <input
            type="text"
            placeholder="Description"
            value={serviceForm.description}
            onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
            className="border p-2 w-full"
          />
          {errors.description && <p style={{ color: 'red' }}>{errors.description}</p>}
          <button
            onClick={isEditing ? updateService : createService}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            {isEditing ? 'Update Service' : 'Create Service'}
          </button>
        </div>
      </div>

      {services.length === 0 ? (
        <p className="text-gray-600">No services available.</p>
      ) : (
        <div className="space-y-6">
          {services.map((service) => (
            <div
              key={service.id}
              className="p-6 bg-white shadow-md rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="text-gray-700">Name: {service.name}</p>
                <p className="text-gray-700">Description: {service.description}</p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => startEditService(service)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteService(service.id)}
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

export default Services;
