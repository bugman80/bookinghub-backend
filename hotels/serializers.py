from django.contrib.auth.models import User
from django.utils import timezone
from rest_framework import serializers
from .models import Hotel, Service, Booking
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import ValidationError

# Serializzatore dei servizi
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

# Serializzatore degli hotels
class HotelSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url  # Ritorna l'URL dell'immagine se esiste
        return None
    
    def update(self, instance, validated_data):
        # Rimuove il campo immagine se non presente nei dati inviati (per esempio in caso di modifica di altri dati)
        if 'image' not in validated_data:
            validated_data.pop('image', None)
        return super().update(instance, validated_data)

# Serializzatore delle prenotazioni
class BookingSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    class Meta:
        model = Booking
        fields = '__all__'
    
    def get_user_email(self, obj):
            if obj.user:
                return obj.user.email
            return None
    
    def validate(self, data):
        if data['check_in'] < timezone.now().date():
            raise serializers.ValidationError({'check_in': 'La data di partenza non deve essere passata.'})
        if data['check_out'] <= data['check_in']:
            raise serializers.ValidationError({'check_out': 'La data di partenza deve essere successiva alla data di arrivo.'})
        return data

# Serializzatore dei token jwt
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Aggiungo ulteriori informazioni (non sensibili) al payload del token
        token['firstname'] = user.first_name
        token['lastname'] = user.last_name
        token['email'] = user.email
        token['superuser'] = user.is_superuser

        return token

# Serializzatore dei nuovi utenti
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'first_name', 'last_name', 'password')

    def create(self, validated_data):
        # Crea un nuovo utente con i dati validati
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
        )
        return user