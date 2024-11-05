from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Hotel, Service, Booking
from .serializers import HotelSerializer, ServiceSerializer, BookingSerializer, CustomTokenObtainPairSerializer

# View per la gestione degli Hotels
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

# View per la gestione dei Servizi
class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer

# View per la gestione delle Prenotazioni
class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        try:
            booking = self.get_object()  # Ottieni l'oggetto Booking
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
