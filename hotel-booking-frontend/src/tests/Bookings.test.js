import React from 'react';
import axios from './__mocks__/axios'
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Hotels from '../pages/Hotels';
import * as apis from '../api';
import Bookings from '../pages/Bookings';

describe('Bookings', () => {
    it('visualizza la lista dei bookings per gli utenti guest', async () => {
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista delle prenotazioni
        const mockBookings = {"data":[{ "id": 2, "check_in": "2024-10-28", "check_out": "2024-10-30", "guests": 3, "total_price": "140.00", "status": "pending", "created_at": "2024-10-27T08:48:58.254816Z", "updated_at": "2024-10-27T08:48:58.254877Z", "hotel": 2, "user": 2 }, 
                                { "id": 1, "check_in": "2024-10-01", "check_out": "2024-10-11", "guests": 5, "total_price": "1000.00", "status": "pending", "created_at": "2024-10-26T10:10:36.347566Z", "updated_at": "2024-10-26T15:55:21.976290Z", "hotel": 1, "user": 1 } ]};
        axios.get.mockResolvedValueOnce(mockBookings);

        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                            {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        render(<Bookings />);

        // Verifico che l'utente possa aggiungere/modificare prenotazioni
        await waitFor(() => {expect(screen.queryByText('Aggiungi Prenotazione')).toBeInTheDocument();});

        // Verifico che la lista delle prenotazioni sia visualizzata
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-28 | Partenza: 2024-10-30')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Ospiti: 3')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Prezzo: 140.00')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-01 | Partenza: 2024-10-11')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Ospiti: 5')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Prezzo: 1000.00')).toBeInTheDocument());
    });
    it('visualizza la lista delle prenotazioni per gli utenti admin', async () => {
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista delle prenotazioni
        const mockBookings = {"data":[{ "id": 2, "check_in": "2024-10-28", "check_out": "2024-10-30", "guests": 3, "total_price": "140.00", "status": "pending", "created_at": "2024-10-27T08:48:58.254816Z", "updated_at": "2024-10-27T08:48:58.254877Z", "hotel": 2, "user": 2 }, 
            { "id": 1, "check_in": "2024-10-01", "check_out": "2024-10-11", "guests": 5, "total_price": "1000.00", "status": "accepted", "created_at": "2024-10-26T10:10:36.347566Z", "updated_at": "2024-10-26T15:55:21.976290Z", "hotel": 1, "user": 1 } ]};
        axios.get.mockResolvedValueOnce(mockBookings);

        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);

        render(<Bookings />);
        //Verifico le prenotazioni in pending abbiano il tasto accept/reject
        await waitFor(() => expect(screen.queryByText('Stato: pending')).toBeInTheDocument());
        const buttonsAccept = await waitFor(() => screen.getAllByRole('button', { name: 'Approva' }));
        const buttonsReject = await waitFor(() => screen.getAllByRole('button', { name: 'Rigetta' }));
        expect(buttonsAccept).toHaveLength(1);
        expect(buttonsReject).toHaveLength(1);
        //Verifica che le prenotazioni accettate non hanno nessun tasto
        const buttonsModify = await waitFor(() => screen.getAllByRole('button', { name: 'Modifica' }));
        const buttonsDelete = await waitFor(() => screen.getAllByRole('button', { name: 'Elimina' }));
        expect(buttonsModify).toHaveLength(1);
        expect(buttonsDelete).toHaveLength(1);
    });
    it('verifico la modifica di una prenotazione', async () => {
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista delle prenotazioni
        const mockBookings = {"data":[{ "id": 2, "check_in": "2024-10-28", "check_out": "2024-10-30", "guests": 3, "total_price": "140.00", "status": "pending", "created_at": "2024-10-27T08:48:58.254816Z", "updated_at": "2024-10-27T08:48:58.254877Z", "hotel": 2, "user": 2 }, 
            { "id": 1, "check_in": "2024-10-01", "check_out": "2024-10-11", "guests": 3, "total_price": "1000.00", "status": "pending", "created_at": "2024-10-26T10:10:36.347566Z", "updated_at": "2024-10-26T15:55:21.976290Z", "hotel": 1, "user": 1 } ]};
        axios.get.mockResolvedValueOnce(mockBookings);

        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        render(<Bookings />);

        // Verifico che le prenotazioni vengano visualizzate
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-28 | Partenza: 2024-10-30')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-01 | Partenza: 2024-10-11')).toBeInTheDocument());
        
        //Verifico che venga visualizzato il pulsante di modifica nella lista delle prenotazioni
        const buttons = screen.getAllByRole('button', { name: 'Modifica' });
        //Mi aspetto due prenotazioni in lista
        expect(buttons).toHaveLength(2);
        userEvent.click(buttons[0]);
        
        //Verifico che venga il form per aggiungere/modificare prenotazioni sia popolato con i dati del primo hotel
        await waitFor(() => {expect(screen.queryByText('Modifica Prenotazione')).toBeInTheDocument();});
        const inputElement1 = screen.getByPlaceholderText('Data di Arrivo');
        expect(inputElement1).toHaveValue('2024-10-28');
        const inputElement2 = screen.getByPlaceholderText('Data di Partenza');
        expect(inputElement2).toHaveValue('2024-10-30');
    });
    it('verifico la creazione di una prenotazione', async () => {
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista delle prenotazioni
        const mockBookings = {"data":[{ "id": 2, "check_in": "2024-10-28", "check_out": "2024-10-30", "guests": 3, "total_price": "140.00", "status": "pending", "created_at": "2024-10-27T08:48:58.254816Z", "updated_at": "2024-10-27T08:48:58.254877Z", "hotel": 2, "user": 2 }, 
            { "id": 1, "check_in": "2024-10-01", "check_out": "2024-10-11", "guests": 3, "total_price": "1000.00", "status": "pending", "created_at": "2024-10-26T10:10:36.347566Z", "updated_at": "2024-10-26T15:55:21.976290Z", "hotel": 1, "user": 1 } ]};
        axios.get.mockResolvedValueOnce(mockBookings);

        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
        
        const bookingData = { "id": 3, "check_in": "2024-11-20", "check_out": "2024-11-25", "guests": "10", "total_price": "500.00", "status": "pending", "created_at": "2024-10-26T10:10:36.347566Z", "updated_at": "2024-10-26T15:55:21.976290Z", "hotel": 1, "user": 1 };
        const mockNewBooking = {"data": bookingData};
        axios.post.mockResolvedValueOnce(mockNewBooking);
    
        render(<Bookings />);

        // Verifico che le prenotazioni vengano visualizzate
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-28 | Partenza: 2024-10-30')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-01 | Partenza: 2024-10-11')).toBeInTheDocument());

        const selectHotel = screen.getByTestId('hotel-select');
        const inputArrivo = screen.getByPlaceholderText('Data di Arrivo');
        const inputPartenza = screen.getByPlaceholderText('Data di Partenza');
        const inputOspiti = screen.getByPlaceholderText('Numero di Ospiti');
        
        fireEvent.change(selectHotel, { target: { value: bookingData.hotel } });
        userEvent.type(inputArrivo, bookingData.check_in);
        userEvent.type(inputPartenza, bookingData.check_out);
        userEvent.type(inputOspiti, bookingData.guests);

        const aggiungiButtons = screen.getAllByRole('button', { name: 'Aggiungi' });
        expect(aggiungiButtons).toHaveLength(1);
        userEvent.click(aggiungiButtons[0]);

        //Mi aspetto tre prenotazioni in lista
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-11-20 | Partenza: 2024-11-25')).toBeInTheDocument());
        const buttons = await waitFor(() => screen.getAllByRole('button', { name: 'Elimina' }));
        expect(buttons).toHaveLength(3);
    });
    it('verifico la cancellazione di una prenotazione', async () => {
        const userData = {
            id: 1,
            email: 'test@test.it',
            firstname: 'supername',
            lastname: 'superlastname',
            superuser: true
        };
        jest.spyOn(apis, "getUserData").mockReturnValue(userData);
        // Simula la risposta per la chiamata che recupera la lista delle prenotazioni
        const mockBookings = {"data":[{ "id": 2, "check_in": "2024-10-28", "check_out": "2024-10-30", "guests": 3, "total_price": "140.00", "status": "pending", "created_at": "2024-10-27T08:48:58.254816Z", "updated_at": "2024-10-27T08:48:58.254877Z", "hotel": 2, "user": 2 }, 
            { "id": 1, "check_in": "2024-10-01", "check_out": "2024-10-11", "guests": 3, "total_price": "1000.00", "status": "pending", "created_at": "2024-10-26T10:10:36.347566Z", "updated_at": "2024-10-26T15:55:21.976290Z", "hotel": 1, "user": 1 } ]};
        axios.get.mockResolvedValueOnce(mockBookings);

        // Simula la risposta per la chiamata che recupera la lista degli hotels
        const mockHotels = {"data": [{"id":1,"image_url":"/hotels/hotel2_F64SSWm.jpg","name":"Hotel Colosseo","description":"Nel cuore di Roma, il miglior hotel dove soggiornare","address":"Via Roma 1","phone_number":"06-123456","email":"hotel.roma@hotel.it","city":"Roma","country":"Italia","total_rooms":50,"price_per_night":"100.00","image":"http://localhost:8000/hotels/hotel2_F64SSWm.jpg","is_active":true,"created_at":"2024-10-26T09:53:39.117428Z","updated_at":"2024-10-27T10:14:30.477351Z","services":[3,4,1]},
                {"id":2,"image_url":"/hotels/hotel1_juBMUCQ.jpg","name":"Hotel Madonnina","description":"nel centro di Milano, il miglior hotel dove soggiornare","address":"Via della madonnina, 12","phone_number":"02-234234234","email":"hotel.milan@hotel.it","city":"Milano","country":"Italia","total_rooms":20,"price_per_night":"70.00","image":"http://localhost:8000/hotels/hotel1_juBMUCQ.jpg","is_active":true,"created_at":"2024-10-27T08:44:28.113114Z","updated_at":"2024-10-27T09:07:42.338549Z","services":[3,1]}]};
        axios.get.mockResolvedValueOnce(mockHotels);
    
        render(<Bookings />);

        // Verifico che le prenotazioni vengano visualizzate
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-28 | Partenza: 2024-10-30')).toBeInTheDocument());
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-01 | Partenza: 2024-10-11')).toBeInTheDocument());

        //Verifico che venga visualizzato il pulsante di modifica nella lista degli hotels
        const buttons = screen.getAllByRole('button', { name: 'Elimina' });
        //Mi aspetto due hotels in lista
        expect(buttons).toHaveLength(2);
        userEvent.click(buttons[0]);
        await waitFor(() => expect(screen.queryByText('Arrivo: 2024-10-28 | Partenza: 2024-10-30')).not.toBeInTheDocument());
    });
});
