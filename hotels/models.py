from django.db import models
from django.conf import settings

# Modello per la gestione degli Hotels
class Hotel(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True, null=True)
    address = models.CharField(max_length=255)
    phone_number = models.CharField(max_length=255, blank=True, null=True, unique=True)
    email = models.EmailField(max_length=254, blank=True, null=True, unique=True)
    city = models.CharField(max_length=100)
    country = models.CharField(max_length=100)
    total_rooms = models.PositiveIntegerField()
    price_per_night = models.DecimalField(max_digits=10, decimal_places=2)
    services = models.ManyToManyField('Service', blank=True, related_name='hotels')
    image = models.ImageField(upload_to='hotels/', blank=True, null=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['name']
        verbose_name = "Hotel"
        verbose_name_plural = "Hotels"
    
    def __str__(self):
        return self.name

# Modello per la gestione dei Servizi
class Service(models.Model):
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        ordering = ['name']
        verbose_name = "Service"
        verbose_name_plural = "Services"

# Modello per la gestione delle prenotazioni
class Booking(models.Model):
    # Riferimento all'hotel prenotato (relazione many-to-one)
    hotel = models.ForeignKey('Hotel', on_delete=models.CASCADE, related_name='bookings')

    # Riferimento all'utente che ha effettuato la prenotazione
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='bookings')

    # Data di check-in e check-out
    check_in = models.DateField()
    check_out = models.DateField()

    # Numero di ospiti nella prenotazione
    guests = models.PositiveIntegerField()

    # Prezzo totale della prenotazione
    total_price = models.DecimalField(max_digits=10, decimal_places=2)

    # Stato della prenotazione
    PENDING = 'pending'
    APPROVED = 'approved'
    REJECTED = 'rejected'
    BOOKING_STATUS_CHOICES = [
        (PENDING, 'Pending'),
        (APPROVED, 'Approved'),
        (REJECTED, 'Rejected'),
    ]
    status = models.CharField(
        max_length=10,
        choices=BOOKING_STATUS_CHOICES,
        default=PENDING,
    )

    # Timestamp per la data di creazione e aggiornamento
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Booking"
        verbose_name_plural = "Bookings"

    def __str__(self):
        return f'Booking for {self.hotel.name} by {self.user} from {self.check_in} to {self.check_out}'

    # Metodo per calcolare il numero di notti
    @property
    def nights(self):
        return (self.check_out - self.check_in).days
    
    def save(self, *args, **kwargs):
        self.total_price = self.nights * self.hotel.price_per_night
        super().save(*args, **kwargs)
