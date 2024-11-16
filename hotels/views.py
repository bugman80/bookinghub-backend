from django.contrib.auth.models import User
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Hotel, Service, Booking
from .serializers import (HotelSerializer, 
                          ServiceSerializer, 
                          BookingSerializer, 
                          CustomTokenObtainPairSerializer, 
                          RegisterSerializer, 
                          UserSerializer)

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# View per la gestione degli Hotels
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    # Se l'utente non e' un admin ritorna solo gli hotel attivi
    def get_queryset(self):
        req_user = self.request.user
        if req_user.is_superuser:
            return self.queryset
        return Hotel.objects.filter(is_active=True)

# View per la gestione dei Servizi
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

# View per la gestione delle Prenotazioni
class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    queryset = Booking.objects.all()

    def perform_create(self, serializer):
        # Imposta l'utente autenticato solo in fase di creazione
        serializer.save(user=self.request.user)

    # Se l'utente non e' un admin ritorna solo i suoi bookings
    def get_queryset(self):
        req_user = self.request.user
        if req_user.is_superuser:
            return self.queryset
        return Booking.objects.filter(user=req_user)

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        try:
            booking = self.get_object()  # Ottieni l'oggetto Booking
            new_status = request.data.get('status')

            # verifico che non ci sia overbooking
            if new_status == Booking.APPROVED:
                overlapping_bookings = Booking.objects.filter(
                    check_out__gt=booking.check_in,
                    check_in__lt=booking.check_out,
                    status=Booking.APPROVED
                ).exclude(pk=booking.pk)
                print(overlapping_bookings.first())
                overlapping_bookings_for_user = overlapping_bookings.filter(user=booking.user)
                print(overlapping_bookings_for_user.count())
                print(overlapping_bookings.count())
                if overlapping_bookings_for_user.count():
                    raise ValidationError({"description": "Questo utente ha una prenotazione approvata per questo periodo"})
                if overlapping_bookings.count() >= booking.hotel.total_rooms:
                    raise ValidationError({"description": "Non ci sono stanze disponibili per il periodo selezionato"})

            booking.status = request.data.get('status', booking.status)  # Aggiorna solo il campo status
            booking.save()
            return Response({'message': 'Status updated successfully'}, status=status.HTTP_200_OK)
        except Booking.DoesNotExist:
            return Response({"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND)

# View per la gestione dei Token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

# View per la gestione del logout
class LogoutView(APIView):
    
    def post(self, request):
        try:
            refresh = request.data.get('refresh')
            if not refresh:
                return Response({"error": "Refresh token is required"}, status=status.HTTP_400_BAD_REQUEST)
            # metto il token nella blacklist
            token = RefreshToken(refresh)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
