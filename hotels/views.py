from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Hotel, Service, Booking
from .serializers import HotelSerializer, ServiceSerializer, BookingSerializer, CustomTokenObtainPairSerializer

# View per la gestione degli Hotels
class HotelViewSet(viewsets.ModelViewSet):
    permission_classes = (permissions.IsAuthenticated,)

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
            # Blacklist the token
            token = RefreshToken(refresh)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)
