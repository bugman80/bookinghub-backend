from django.core.mail import send_mail
from django.utils import timezone
from rest_framework import serializers
from .models import Hotel, Service, Booking, CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


# Serializzatore dei servizi
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = "__all__"


# Serializzatore degli hotels
class HotelSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = "__all__"

    def get_image_url(self, obj):
        # Ritorno l'URL dell'immagine se esiste
        if obj.image:
            return obj.image.url
        return None

    def update(self, instance, validated_data):
        # Rimuovo il campo immagine se non presente nei dati inviati
        # (per esempio in caso di modifica di altri dati)
        if "image" not in validated_data:
            validated_data.pop("image", None)
        return super().update(instance, validated_data)


# Serializzatore delle prenotazioni
class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Booking
        fields = "__all__"

    def get_user_email(self, obj):
        if obj.user:
            return obj.user.email
        return None

    def validate(self, data):
        msg1 = "La data di partenza non deve essere passata."
        msg2 = "La data di partenza deve essere successiva alla data di arrivo."
        # le date di check-in e check-out devono essere congruenti
        if data["check_in"] < timezone.now().date():
            raise serializers.ValidationError({"check_in": msg1})
        if data["check_out"] <= data["check_in"]:
            raise serializers.ValidationError({"check_out": msg2})
        return data


# Serializzatore dei token jwt
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Aggiungo ulteriori informazioni (non sensibili) al payload del token
        token["firstname"] = user.first_name
        token["lastname"] = user.last_name
        token["email"] = user.email
        token["superuser"] = user.is_superuser

        return token


# Serializzatore per la registrazione dei nuovi utenti
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ("username", "email", "first_name", "last_name", "password")

    def create(self, validated_data):
        # Crea un nuovo utente con i dati validati
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
        )
        subject = 'Registrazione avvenuta con successo'
        message = 'Ciao,\n\nBenvenuto su Prenotiamo ora puoi iniziare a pianificare la tua vacanza da sogno.\n\nCordiali saluti,\nIl team di Prenotiamo'
        send_mail(subject, message, None, [user.email])
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ["id", "username", "email", "first_name", "last_name", "is_superuser"]
