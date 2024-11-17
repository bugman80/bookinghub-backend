from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from hotels.views import (
    HotelViewSet,
    ServiceViewSet,
    BookingViewSet,
    LogoutView,
    CustomTokenObtainPairView,
    UserRegistrationView,
    UserViewSet,
)
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r"hotels", HotelViewSet)
router.register(r"services", ServiceViewSet)
router.register(r"bookings", BookingViewSet)
router.register(r"users", UserViewSet)

urlpatterns = [
    path("api/", include(router.urls)),
    path("admin/", admin.site.urls),
    path("api/token/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/logout/", LogoutView.as_view(), name="token_blacklist"),
    path("api/register/", UserRegistrationView.as_view(), name="register"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
