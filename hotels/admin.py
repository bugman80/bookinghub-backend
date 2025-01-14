from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Hotel, Service, Booking, CustomUser


# Registrazione del modello Hotel
@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = (
        "name",
        "city",
        "country",
        "total_rooms",
        "price_per_night",
        "is_active",
    )
    search_fields = ("name", "city", "country")
    list_filter = ("city", "country", "is_active")


# Registrazione del modello Service
@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ("name",)
    search_fields = ("name",)


# Registrazione del modello Booking
@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "hotel",
        "user",
        "check_in",
        "check_out",
        "guests",
        "total_price",
        "status",
    )
    search_fields = ("hotel__name", "user__username")
    list_filter = ("status", "check_in", "check_out")


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets
