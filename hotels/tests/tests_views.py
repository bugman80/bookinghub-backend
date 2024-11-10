import pytest
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.contrib.auth.models import User
from ..models import Hotel, Booking
from datetime import datetime, timedelta

@pytest.mark.django_db
def test_update_booking_status():
    # Creo un utente di test
    user = User.objects.create(first_name="Test Name", last_name="Test Last Name", email="user@user.it")
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    # Crea un hotel di test
    hotel = Hotel.objects.create(name="Test Hotel", 
                                 description="Hotel di test", 
                                 address="via di test, 2", 
                                 phone_number="123123", 
                                 email="testhotel@test.it", 
                                 city="test", 
                                 country="test", 
                                 total_rooms=2, 
                                 price_per_night=10, 
                                 is_active=True)

    # Creo una prenotazione per l'hotel
    prenotazione = Booking.objects.create(hotel=hotel, 
                                          user=user, 
                                          check_in=datetime.today() + timedelta(weeks=1), 
                                          check_out=datetime.today() + timedelta(weeks=2),
                                          guests=2)
    
    # Verifico che la prenotazione sia in stato pending
    assert prenotazione.status == 'pending'
    
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
    
    url = reverse('booking-update-status', kwargs={'pk': prenotazione.pk})
    data = {'status': 'approved'}   
    response = client.patch(url, data, format='json')

    # Verifico lo status code 200
    assert response.status_code == status.HTTP_200_OK

    # Verifico che lo stato ora sia approved
    prenotazione.refresh_from_db()
    assert prenotazione.status == 'approved'


@pytest.mark.django_db
def test_overlapping_bookings():
    # Creo un utente di test
    user = User.objects.create(first_name="Test Name", last_name="Test Last Name", email="user@user.it")
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    # Crea un hotel di test
    hotel = Hotel.objects.create(name="Test Hotel", 
                                 description="Hotel di test", 
                                 address="via di test, 2", 
                                 phone_number="123123", 
                                 email="testhotel@test.it", 
                                 city="test", 
                                 country="test", 
                                 total_rooms=2, 
                                 price_per_night=10, 
                                 is_active=True)

    # Creo una prenotazione per l'hotel
    prenotazione1 = Booking.objects.create(hotel=hotel, 
                                           user=user, 
                                           check_in=datetime.today() + timedelta(weeks=1), 
                                           check_out=datetime.today() + timedelta(weeks=2),
                                           guests=2)
    prenotazione2 = Booking.objects.create(hotel=hotel, 
                                           user=user, 
                                           check_in=datetime.today() + timedelta(weeks=3), 
                                           check_out=datetime.today() + timedelta(weeks=4),
                                           guests=2)
    prenotazione3 = Booking.objects.create(hotel=hotel, 
                                           user=user, 
                                           check_in=datetime.today() + timedelta(weeks=3), 
                                           check_out=datetime.today() + timedelta(weeks=4),
                                           guests=2)
    
    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token)
    
    url = reverse('booking-update-status', kwargs={'pk': prenotazione1.pk})
    data = {'status': 'approved'}   
    response = client.patch(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK

    url = reverse('booking-update-status', kwargs={'pk': prenotazione2.pk})
    data = {'status': 'approved'}   
    response = client.patch(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK

     # Verifico che non consenta di avere piu' prenotazione per lo stesso periodo per lo stesso utente
    url = reverse('booking-update-status', kwargs={'pk': prenotazione3.pk})
    data = {'status': 'approved'}   
    response = client.patch(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['description'] == "Questo utente ha una prenotazione approvata per questo periodo"


@pytest.mark.django_db
def test_overbooking():
    # Creo un utente di test
    user1 = User.objects.create(first_name="Test Name1", username="uno", last_name="Test Last Name1", email="user1@user.it")
    user2 = User.objects.create(first_name="Test Name2", username="due", last_name="Test Last Name2", email="user2@user.it")
    user3 = User.objects.create(first_name="Test Name3", username="tre", last_name="Test Last Name3", email="user3@user.it")
    refresh1 = RefreshToken.for_user(user1)
    access_token1 = str(refresh1.access_token)
    refresh2 = RefreshToken.for_user(user2)
    access_token2 = str(refresh2.access_token)
    refresh3 = RefreshToken.for_user(user3)
    access_token3 = str(refresh3.access_token)
    # Crea un hotel di test
    hotel = Hotel.objects.create(name="Test Hotel", 
                                 description="Hotel di test", 
                                 address="via di test, 2", 
                                 phone_number="123123", 
                                 email="testhotel@test.it", 
                                 city="test", 
                                 country="test", 
                                 total_rooms=2, 
                                 price_per_night=10, 
                                 is_active=True)

    # Creo una prenotazione per l'hotel
    prenotazione1 = Booking.objects.create(hotel=hotel, 
                                           user=user1, 
                                           check_in=datetime.today() + timedelta(weeks=1), 
                                           check_out=datetime.today() + timedelta(weeks=2),
                                           guests=2)
    prenotazione2 = Booking.objects.create(hotel=hotel, 
                                           user=user2, 
                                           check_in=datetime.today() + timedelta(weeks=1), 
                                           check_out=datetime.today() + timedelta(weeks=2),
                                           guests=2)
    prenotazione3 = Booking.objects.create(hotel=hotel, 
                                           user=user3, 
                                           check_in=datetime.today() + timedelta(weeks=1), 
                                           check_out=datetime.today() + timedelta(weeks=2),
                                           guests=2)
    
    client1 = APIClient()
    client1.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token1)

    client2 = APIClient()
    client2.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token2)

    client3 = APIClient()
    client3.credentials(HTTP_AUTHORIZATION='Bearer ' + access_token3)
    
    url = reverse('booking-update-status', kwargs={'pk': prenotazione1.pk})
    data = {'status': 'approved'}   
    response = client1.patch(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK

    url = reverse('booking-update-status', kwargs={'pk': prenotazione2.pk})
    data = {'status': 'approved'}   
    response = client2.patch(url, data, format='json')

    assert response.status_code == status.HTTP_200_OK

     # Verifico che non consenta di avere piu' prenotazione per lo stesso periodo per lo stesso utente
    url = reverse('booking-update-status', kwargs={'pk': prenotazione3.pk})
    data = {'status': 'approved'}   
    response = client3.patch(url, data, format='json')
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert response.data['description'] == "Non ci sono stanze disponibili per il periodo selezionato"
