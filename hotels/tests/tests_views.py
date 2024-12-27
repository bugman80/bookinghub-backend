import pytest
from rest_framework.test import APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from ..models import Hotel, Booking, CustomUser
from datetime import datetime, timedelta


@pytest.mark.django_db
def test_update_booking_status():
    """
    questo test verifica un semplice scenario di approvazione di una prenotazione
    """
    # Creo un utente di test
    user = CustomUser.objects.create(
        first_name="Test Name", last_name="Test Last Name", email="user@user.it"
    )
    # Creo un token per l'utente
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    # Crea un hotel di test
    hotel = Hotel.objects.create(
        name="Test Hotel",
        description="Hotel di test",
        address="via di test, 2",
        phone_number="123123",
        email="testhotel@test.it",
        city="test",
        country="test",
        total_rooms=2,
        price_per_night=10,
        is_active=True,
    )

    # Creo una prenotazione per l'hotel
    prenotazione = Booking.objects.create(
        hotel=hotel,
        user=user,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )

    # Verifico che la prenotazione sia in stato pending
    assert prenotazione.status == "pending"

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)
    # Approvo la prenotazione
    url = reverse("booking-update-status", kwargs={"pk": prenotazione.pk})
    data = {"status": "approved"}
    response = client.patch(url, data, format="json")

    # Verifico lo status code 200
    assert response.status_code == status.HTTP_200_OK

    # Verifico che lo stato ora sia approved
    prenotazione.refresh_from_db()
    assert prenotazione.status == "approved"


@pytest.mark.django_db
def test_overlapping_bookings():
    """
    questo test verifica che la validazione del booking
    rilevi un overlap di prenotazione
    per lo stesso utente nello stesso periodo
    """
    # Creo un utente di test
    user = CustomUser.objects.create(
        first_name="Test Name", last_name="Test Last Name", email="user@user.it"
    )
    # Creo un token per l'utente
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    # Crea un hotel di test
    hotel = Hotel.objects.create(
        name="Test Hotel",
        description="Hotel di test",
        address="via di test, 2",
        phone_number="123123",
        email="testhotel@test.it",
        city="test",
        country="test",
        total_rooms=2,
        price_per_night=10,
        is_active=True,
    )

    booking_create_url = reverse("booking-list")
    # Creo tre prenotazioni per lo stesso utente e hotel e le ultime due sono in overlap

    prenotazione1 = {
        "hotel": hotel.id,
        "user": user.id,
        "check_in": (datetime.today() + timedelta(weeks=1)).date().isoformat(),
        "check_out": (datetime.today() + timedelta(weeks=2)).date().isoformat(),
        "guests": 2,
        "total_price": 140,
    }
    prenotazione2 = {
        "hotel": hotel.id,
        "user": user.id,
        "check_in": (datetime.today() + timedelta(weeks=3)).date().isoformat(),
        "check_out": (datetime.today() + timedelta(weeks=4)).date().isoformat(),
        "guests": 2,
        "total_price": 140,
    }
    prenotazione3 = {
        "hotel": hotel.id,
        "user": user.id,
        "check_in": (datetime.today() + timedelta(weeks=3)).date().isoformat(),
        "check_out": (datetime.today() + timedelta(weeks=4)).date().isoformat(),
        "guests": 2,
        "total_price": 140,
    }

    client = APIClient()
    client.credentials(HTTP_AUTHORIZATION="Bearer " + access_token)
    # Creo la prima ed e' ok
    response1 = client.post(booking_create_url, prenotazione1, format="json")
    assert response1.status_code == status.HTTP_201_CREATED

    # Creo la seconda ed e' ok
    response2 = client.post(booking_create_url, prenotazione2, format="json")
    assert response2.status_code == status.HTTP_201_CREATED

    # La terza mi rileva l'overlap e va in errore
    response3 = client.post(booking_create_url, prenotazione3, format="json")
    assert response3.status_code == status.HTTP_400_BAD_REQUEST
    assert (
        response3.data["description"] == "Hai gia' una prenotazione per questo periodo"
    )


@pytest.mark.django_db
def test_overbooking():
    """
    questo test verifica che la validazione dei bookings
    rilevi un overbooking per l'hotel
    ovvero che il numero di prenotazioni in overlap
    non superi il numero delle camere disponibili
    """
    # Creo tre utenti di test
    user1 = CustomUser.objects.create(
        first_name="Test Name1",
        username="uno",
        last_name="Test Last Name1",
        email="user1@user.it",
    )
    user2 = CustomUser.objects.create(
        first_name="Test Name2",
        username="due",
        last_name="Test Last Name2",
        email="user2@user.it",
    )
    user3 = CustomUser.objects.create(
        first_name="Test Name3",
        username="tre",
        last_name="Test Last Name3",
        email="user3@user.it",
    )
    # Creo tre token per gli utenti
    refresh1 = RefreshToken.for_user(user1)
    access_token1 = str(refresh1.access_token)
    refresh2 = RefreshToken.for_user(user2)
    access_token2 = str(refresh2.access_token)
    refresh3 = RefreshToken.for_user(user3)
    access_token3 = str(refresh3.access_token)
    # Crea un hotel di test con due camere solamente
    hotel = Hotel.objects.create(
        name="Test Hotel",
        description="Hotel di test",
        address="via di test, 2",
        phone_number="123123",
        email="testhotel@test.it",
        city="test",
        country="test",
        total_rooms=2,
        price_per_night=10,
        is_active=True,
    )

    # Creo 3 prenotazioni per l'albergo tutte in overlap con 3 utenti diversi
    prenotazione1 = Booking.objects.create(
        hotel=hotel,
        user=user1,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )
    prenotazione2 = Booking.objects.create(
        hotel=hotel,
        user=user2,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )
    prenotazione3 = Booking.objects.create(
        hotel=hotel,
        user=user3,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )

    # Creo i 3 clients per gli utenti
    client1 = APIClient()
    client1.credentials(HTTP_AUTHORIZATION="Bearer " + access_token1)

    client2 = APIClient()
    client2.credentials(HTTP_AUTHORIZATION="Bearer " + access_token2)

    client3 = APIClient()
    client3.credentials(HTTP_AUTHORIZATION="Bearer " + access_token3)

    # Approvo la prima prenotazione con successo
    url = reverse("booking-update-status", kwargs={"pk": prenotazione1.pk})
    data = {"status": "approved"}
    response = client1.patch(url, data, format="json")

    assert response.status_code == status.HTTP_200_OK

    # Approvo la seconda prenotazione con successo
    url = reverse("booking-update-status", kwargs={"pk": prenotazione2.pk})
    data = {"status": "approved"}
    response = client2.patch(url, data, format="json")

    assert response.status_code == status.HTTP_200_OK

    # La terza approvazione fallisce perche' l'hotel non ha piu'
    # camere disponibili per il periodo scelto
    url = reverse("booking-update-status", kwargs={"pk": prenotazione3.pk})
    data = {"status": "approved"}
    response = client3.patch(url, data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert (
        response.data["description"]
        == "Non ci sono stanze disponibili per il periodo selezionato"
    )


@pytest.mark.django_db
def test_hotels_filtering():
    """
    questo test verifica che la lista degli hotels e' completa se l'utente e' superuser
    altrimenti per gli utenti guest la lista degli hotels comprende solo quelli attivi
    """
    # Creo due utenti di test, uno guest e uno superuser
    user1 = CustomUser.objects.create(
        first_name="Test Name1",
        username="uno",
        last_name="Test Last Name1",
        email="user1@user.it",
        is_superuser=True,
    )
    user2 = CustomUser.objects.create(
        first_name="Test Name2",
        username="due",
        last_name="Test Last Name2",
        email="user2@user.it",
    )
    # Creo due token per gli utenti
    refresh1 = RefreshToken.for_user(user1)
    access_token1 = str(refresh1.access_token)
    refresh2 = RefreshToken.for_user(user2)
    access_token2 = str(refresh2.access_token)
    # Crea due hotels di test, uno attivo e uno non attivo
    Hotel.objects.create(
        name="Test Hotel1",
        description="Hotel di test 1",
        address="via di test1, 2",
        phone_number="1231234",
        email="testhotel1@test.it",
        city="test1",
        country="test1",
        total_rooms=2,
        price_per_night=10,
        is_active=True,
    )

    Hotel.objects.create(
        name="Test Hotel2",
        description="Hotel di test 2",
        address="via di test2, 2",
        phone_number="1231235",
        email="testhotel2@test.it",
        city="test2",
        country="test2",
        total_rooms=2,
        price_per_night=10,
        is_active=False,
    )

    # Creo i due clients per gli utenti
    client1 = APIClient()
    client1.credentials(HTTP_AUTHORIZATION="Bearer " + access_token1)

    client2 = APIClient()
    client2.credentials(HTTP_AUTHORIZATION="Bearer " + access_token2)

    # Recupero la lista degli hotels per l'utente superuser
    response = client1.get("/api/hotels/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 2

    # Recupero la lista degli hotels per l'utente guest
    response = client2.get("/api/hotels/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1


@pytest.mark.django_db
def test_bookings_filtering():
    """
    questo test verifica che la lista delle prenotazioni
    e' completa se l'utente e' superuser
    altrimenti per gli utenti guest la lista
    comprende solo le proprie prenotazioni
    """
    # Creo tre utenti di test, due guest e uno superuser
    user1 = CustomUser.objects.create(
        first_name="Test Name1",
        username="uno",
        last_name="Test Last Name1",
        email="user1@user.it",
        is_superuser=True,
    )
    user2 = CustomUser.objects.create(
        first_name="Test Name2",
        username="due",
        last_name="Test Last Name2",
        email="user2@user.it",
    )
    user3 = CustomUser.objects.create(
        first_name="Test Name3",
        username="tre",
        last_name="Test Last Name3",
        email="user3@user.it",
    )
    # Creo due token per gli utenti admin e guest
    refresh1 = RefreshToken.for_user(user1)
    access_token1 = str(refresh1.access_token)
    refresh2 = RefreshToken.for_user(user2)
    access_token2 = str(refresh2.access_token)
    # Crea un hotel per le prenotazioni
    hotel = Hotel.objects.create(
        name="Test Hotel",
        description="Hotel di test",
        address="via di test, 2",
        phone_number="1231234",
        email="testhotel@test.it",
        city="test",
        country="test",
        total_rooms=5,
        price_per_night=10,
        is_active=True,
    )

    # Creo i due clients per gli utenti guest e superuser
    client1 = APIClient()
    client1.credentials(HTTP_AUTHORIZATION="Bearer " + access_token1)

    client2 = APIClient()
    client2.credentials(HTTP_AUTHORIZATION="Bearer " + access_token2)

    # Creo tre prenotazioni, una per utente guest1, una per guest2 e una per superuser
    # Creo 3 prenotazioni per l'albergo tutte in overlap con 3 utenti diversi
    Booking.objects.create(
        hotel=hotel,
        user=user1,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )
    Booking.objects.create(
        hotel=hotel,
        user=user2,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )
    Booking.objects.create(
        hotel=hotel,
        user=user3,
        check_in=datetime.today() + timedelta(weeks=1),
        check_out=datetime.today() + timedelta(weeks=2),
        guests=2,
    )

    # Recupero la lista delle prenotazioni
    # per l'utente superuser e mi aspetto le veda tutte
    response = client1.get("/api/bookings/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 3

    # Recupero la lista delle prenotazioni
    # per l'utente guest e mi aspetto veda solo la sua
    response = client2.get("/api/bookings/")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data) == 1
