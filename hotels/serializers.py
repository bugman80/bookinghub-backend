from rest_framework import serializers
from .models import Hotel, Service, Booking
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'

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
        # Remove the 'image' field if it's not present in the update request
        if 'image' not in validated_data:
            validated_data.pop('image', None)
        return super().update(instance, validated_data)

class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = '__all__'

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Aggiungi ulteriori informazioni al payload del token
        token['name'] = user.first_name
        token['lastname'] = user.last_name
        token['email'] = user.email
        token['superuser'] = user.is_superuser  # Assumendo che il modello utente abbia un campo 'role'

        return token