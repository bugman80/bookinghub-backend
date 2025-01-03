from django.core.mail import send_mail
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Hotel, Service, Booking, CustomUser
from .serializers import (
    HotelSerializer,
    ServiceSerializer,
    BookingSerializer,
    CustomTokenObtainPairSerializer,
    RegisterSerializer,
    UserSerializer,
)


class UserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer


# View per la gestione degli Hotels
class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer

    # Se l'utente non e' un admin ritorna solo gli hotel attivi
    def get_queryset(self):
        req_user = self.request.user
        if req_user.is_superuser:
            return Hotel.objects.all()
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
        self.validate_booking(serializer.validated_data, None)
        serializer.save(user=self.request.user)

    def perform_update(self, serializer):
        booking = self.get_object()
        self.validate_booking(serializer.validated_data, booking)
        serializer.save()

    # Se l'utente non e' un admin ritorna solo i suoi bookings
    def get_queryset(self):
        req_user = self.request.user
        if req_user.is_superuser:
            return Booking.objects.all()
        return Booking.objects.filter(user=req_user)

    @action(detail=True, methods=["patch"])
    def update_status(self, request, pk=None):
        try:
            booking = self.get_object()  # Ottieni l'oggetto Booking
            new_status = request.data.get("status")
            if new_status == Booking.APPROVED:
                self.validate_booking(
                    {
                        "status": new_status,
                        "check_in": booking.check_in,
                        "check_out": booking.check_out,
                        "hotel": booking.hotel,
                        "user": booking.user,
                    },
                    booking,
                )
            booking.status = request.data.get("status", booking.status)
            booking.save()
            subject = f"""Prenotazione {new_status}"""
            message = f"""
            Ciao,

            La tua prenotazione per l'hotel {booking.hotel} con data di check-in {booking.check_in} e data di check-out {booking.check_out} è stata {new_status}.

            Cordiali saluti,
            
            Il team di Prenotiamo
            """
            send_mail(subject, message, None, [booking.user.email])
            return Response(
                {"message": "Status updated successfully"}, status=status.HTTP_200_OK
            )
        except Booking.DoesNotExist:
            return Response(
                {"error": "Booking not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def validate_booking(self, data, current_booking=None):
        """
        Metodo di validazione per evitare overbooking e conflitti.
        """
        check_in = data.get(
            "check_in", current_booking.check_in if current_booking else None
        )
        check_out = data.get(
            "check_out", current_booking.check_out if current_booking else None
        )
        hotel = data.get("hotel", current_booking.hotel if current_booking else None)
        user = data.get(
            "user", current_booking.user if current_booking else self.request.user
        )
        status = data.get("status", Booking.PENDING)

        if status == Booking.APPROVED:
            """
            verifico che ci siano ancora stanze disponibili per il periodo scelto e l'albergo scelto
            """
            msg = "Non ci sono stanze disponibili per il periodo selezionato"

            overlapping_bookings = Booking.objects.filter(
                check_out__gt=check_in,
                check_in__lt=check_out,
                status=Booking.APPROVED,
                hotel=hotel,
            )
            if current_booking:
                overlapping_bookings = overlapping_bookings.exclude(
                    pk=current_booking.pk
                )
            if overlapping_bookings.count() >= hotel.total_rooms:
                raise ValidationError({"description": msg})
        if status == Booking.PENDING:
            """
            verifico che l'utente non crei bookings in overlap a prescindere dall'albergo
            """
            msg = "Hai gia' una prenotazione per questo periodo"

            overlapping_bookings = Booking.objects.filter(
                check_out__gt=check_in, check_in__lt=check_out, user=user
            ).exclude(status=Booking.REJECTED)
            if current_booking:
                overlapping_bookings = overlapping_bookings.exclude(
                    pk=current_booking.pk
                )
            if overlapping_bookings.exists():
                raise ValidationError({"description": msg})


# View per la gestione dei Token
class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# View per la gestione del logout
class LogoutView(APIView):

    def post(self, request):
        try:
            refresh = request.data.get("refresh")
            if not refresh:
                return Response(
                    {"error": "Refresh token is required"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # metto il token nella blacklist
            token = RefreshToken(refresh)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class UserRegistrationView(CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    authentication_classes = []
