import pytest
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from django.contrib.auth.models import User
from ..models import Hotel, Booking
from datetime import datetime

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
                                          check_in=datetime.strptime("2024-12-25", "%Y-%m-%d"), 
                                          check_out=datetime.strptime("2024-12-31", "%Y-%m-%d"),
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
