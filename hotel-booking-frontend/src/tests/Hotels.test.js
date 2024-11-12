import React from 'react';
import axios from './__mocks__/axios'
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hotels from '../pages/Hotels';
import * as apis from '../api';

describe('Hotels', () => {
    it('visualizza la lista degli hotels per gli utenti guest', async () => {
        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        // Simula la risposta per la chiamata che recupera la lista dei servizi
        const mockServices = {"data": [{"id":3,"name":"parking lot","description":"private parking lot"},
            {"id":4,"name":"restaurant","description":"high quality restaurant"},
            {"id":5,"name":"swimming pool","description":"olympic swimming pool"},
            {"id":1,"name":"wifi","description":"high speed wifi"}]};
        axios.get.mockResolvedValueOnce(mockServices);
    
        render(<Hotels />);

        // Verifico che l'utente non possa aggiungere/modificare hotels
        await waitFor(() => {expect(screen.queryByText('Aggiungi Hotel')).not.toBeInTheDocument();});
    
        // Verifica che i servizi siano visualizzati
        await waitFor(() => {expect(screen.queryByText('Servizi: parking lot, restaurant, wifi')).toBeInTheDocument();});
        await waitFor(() => {expect(screen.queryByText('Servizi: parking lot, wifi')).toBeInTheDocument();});
    
        // Verifica che i nomi degli hotels vengano visualizzati
        await waitFor(() => expect(screen.queryByText('Hotel Colosseo')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Hotel Madonnina')).toBeInTheDocument());
    });
    it('visualizza la lista degli hotels per gli utenti admin', async () => {
        // Simulo che l'utente sia superuser
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        // Simula la risposta per la chiamata che recupera la lista dei servizi
        const mockServices = {"data": [{"id":3,"name":"parking lot","description":"private parking lot"},
            {"id":4,"name":"restaurant","description":"high quality restaurant"},
            {"id":5,"name":"swimming pool","description":"olympic swimming pool"},
            {"id":1,"name":"wifi","description":"high speed wifi"}]};
        axios.get.mockResolvedValueOnce(mockServices);
    
        render(<Hotels />);

        // Verifico che venga visualizzato il form per aggiungere/modificare hotels
        await waitFor(() => {expect(screen.queryByText('Aggiungi Hotel')).toBeInTheDocument();});
    });
    it('verifico la modifica di un hotel', async () => {
        // Simulo che l'utente sia superuser
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        // Simula la risposta per la chiamata che recupera la lista dei servizi
        const mockServices = {"data": [{"id":3,"name":"parking lot","description":"private parking lot"},
            {"id":4,"name":"restaurant","description":"high quality restaurant"},
            {"id":5,"name":"swimming pool","description":"olympic swimming pool"},
            {"id":1,"name":"wifi","description":"high speed wifi"}]};
        axios.get.mockResolvedValueOnce(mockServices);
    
        render(<Hotels />);

        // Verifica che i nomi degli hotels vengano visualizzati
        await waitFor(() => expect(screen.queryByText('Hotel Colosseo')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Hotel Madonnina')).toBeInTheDocument());

        // Verifico che venga visualizzato il pulsante di modifica nella lista degli hotels
        const buttons = screen.getAllByRole('button', { name: 'Modifica' });
        // Mi aspetto due hotels in lista
        expect(buttons).toHaveLength(2);
        userEvent.click(buttons[0]);
        await waitFor(() => expect(screen.queryByText('Hotel Madonnina')).toBeInTheDocument());
        // Verifico che venga il form per aggiungere/modificare hotels sia popolato con i dati del primo hotel
        await waitFor(() => {expect(screen.queryByText('Modifica Hotel')).toBeInTheDocument();});
        const inputElement = screen.getByPlaceholderText('Nome');
        expect(inputElement).toHaveValue('Hotel Colosseo');
    });
    it('verifico la creazione di un hotel', async () => {
        // Simulo che l'utente sia superuser
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        // Simula la risposta per la chiamata che recupera la lista dei servizi
        const mockServices = {"data": [{"id":3,"name":"parking lot","description":"private parking lot"},
            {"id":4,"name":"restaurant","description":"high quality restaurant"},
            {"id":5,"name":"swimming pool","description":"olympic swimming pool"},
            {"id":1,"name":"wifi","description":"high speed wifi"}]};
        axios.get.mockResolvedValueOnce(mockServices);

        const hotelData = {"id":3,"image_url":"/hotels/hotel3_F64SSWm.jpg","name":"Hotel Napoli","description":"Nel cuore di Napoli, il miglior hotel dove soggiornare","address":"Via Napoli 1","phone_number":"04-123456","email":"hotel.napoli@hotel.it","city":"Napoli","country":"Italia","total_rooms":"40","price_per_night":"80.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]};
        const mockNewHotel = {"data": hotelData};
        axios.post.mockResolvedValueOnce(mockNewHotel);
    
        render(<Hotels />);

        // Verifica che i nomi degli hotels vengano visualizzati
        await waitFor(() => expect(screen.queryByText('Hotel Colosseo')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Hotel Madonnina')).toBeInTheDocument());

        // Popolo il form di creazione
        const inputNome = screen.getByPlaceholderText('Nome');
        const inputDescrizione = screen.getByPlaceholderText('Descrizione');
        const inputIndirizzo = screen.getByPlaceholderText('Indirizzo');
        const inputTelefono = screen.getByPlaceholderText('Telefono');
        const inputEmail = screen.getByPlaceholderText('Email');
        const inputCitta = screen.getByPlaceholderText('Citta\'');
        const inputPaese = screen.getByPlaceholderText('Paese');
        const inputCamere = screen.getByPlaceholderText('Numero di Camere');
        const inputPrezzo = screen.getByPlaceholderText('Prezzo per notte');
        const fileInput = screen.getByLabelText(/Seleziona Immagine/i);
        
        const file = new File(['contenuto del file'], 'immagine.jpg', { type: 'image/jpeg' });
        userEvent.upload(fileInput, file);

        userEvent.type(inputNome, hotelData.name);
        userEvent.type(inputDescrizione, hotelData.description);
        userEvent.type(inputIndirizzo, hotelData.address);
        userEvent.type(inputTelefono, hotelData.phone_number);
        userEvent.type(inputEmail, hotelData.email);
        userEvent.type(inputCitta, hotelData.city);
        userEvent.type(inputPaese, hotelData.country);
        userEvent.type(inputCamere, hotelData.total_rooms);
        userEvent.type(inputPrezzo, hotelData.price_per_night);
        
        // Clikko aggiungi
        const aggiungiButtons = screen.getAllByRole('button', { name: 'Aggiungi' });
        expect(aggiungiButtons).toHaveLength(1);
        userEvent.click(aggiungiButtons[0]);
        
        // Verifico il nuovo Hotel sia in lista ed abbia i pulstanti per le actions
        await waitFor(() => expect(screen.queryByText('Hotel Napoli')).toBeInTheDocument());
        const buttons = await waitFor(() => screen.getAllByRole('button', { name: 'Elimina' }));
        // Adesso mi aspetto tre hotels in lista
        expect(buttons).toHaveLength(3);
    });
    it('verifico la cancellazione di un hotel', async () => {
        // Simulo che l'utente sia superuser
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        // Simula la risposta per la chiamata che recupera la lista dei servizi
        const mockServices = {"data": [{"id":3,"name":"parking lot","description":"private parking lot"},
            {"id":4,"name":"restaurant","description":"high quality restaurant"},
            {"id":5,"name":"swimming pool","description":"olympic swimming pool"},
            {"id":1,"name":"wifi","description":"high speed wifi"}]};
        axios.get.mockResolvedValueOnce(mockServices);
    
        render(<Hotels />);

        // Verifica che i nomi degli hotels vengano visualizzati
        await waitFor(() => expect(screen.queryByText('Hotel Colosseo')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Hotel Madonnina')).toBeInTheDocument());

        // Verifico che venga visualizzato il pulsante di cancellazione nella lista degli hotels
        const buttons = screen.getAllByRole('button', { name: 'Elimina' });
        // Mi aspetto due hotels in lista
        expect(buttons).toHaveLength(2);
        // Clikko il pulsante elimina
        userEvent.click(buttons[0]);
        // Mi aspetto che l'hotel non sia piu' visualizzato
        await waitFor(() => expect(screen.queryByText('Hotel Colosseo')).not.toBeInTheDocument());
    });
});
