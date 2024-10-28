import React from 'react';
//import * as axios from "axios";
import axios from './__mocks__/axios'
import { render, screen, waitFor } from '@testing-library/react';
import Hotels from '../pages/Hotels';

describe('Hotels', () => {
    it('renders hotels data for guest', async () => {
        // Simula la risposta per la chiamata dell'utente
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels); // Chiamata per l'utente
    
        // Simula la risposta per la chiamata dei post
        const mockServices = {"data": [{"id":3,"name":"parking lot","description":"private parking lot"},
            {"id":4,"name":"restaurant","description":"high quality restaurant"},
            {"id":5,"name":"swimming pool","description":"olympic swimming pool"},
            {"id":1,"name":"wifi","description":"high speed wifi"}]};
        axios.get.mockResolvedValueOnce(mockServices); // Chiamata per i post
    
        render(<Hotels />);
    
        // Verifica che i servizi siano visualizzati
        await waitFor(() => {expect(screen.getByText('Servizi: parking lot, restaurant, wifi')).toBeInTheDocument();});
        await waitFor(() => {expect(screen.getByText('Servizi: parking lot, wifi')).toBeInTheDocument();});
    
        // Verifica che i nomi degli hotels vengano visualizzati
        await waitFor(() => expect(screen.getByText('Hotel Colosseo')).toBeInTheDocument());
        await waitFor(() => expect(screen.getByText('Hotel Madonnina')).toBeInTheDocument());
    });
});
