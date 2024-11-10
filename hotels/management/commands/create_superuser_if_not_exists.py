from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.db import IntegrityError
import os

class Command(BaseCommand):
    help = 'Crea un superuser se non esiste già.'

    def handle(self, *args, **kwargs):
        User = get_user_model()
        
        # Recupera le credenziali del superuser dalle variabili d'ambiente
        username = os.getenv("DJANGO_SUPERUSER_USERNAME", "admin")
        email = os.getenv("DJANGO_SUPERUSER_EMAIL", "admin@example.com")
        password = os.getenv("DJANGO_SUPERUSER_PASSWORD", "password")

        # Verifica se il superuser esiste
        if not User.objects.filter(username=username).exists():
            try:
                User.objects.create_superuser(username=username, email=email, password=password)
                self.stdout.write(self.style.SUCCESS(f"Superuser '{username}' creato con successo."))
            except IntegrityError:
                self.stdout.write(self.style.WARNING(f"Non è stato possibile creare il superuser: potrebbe già esistere."))
        else:
            self.stdout.write(self.style.WARNING(f"Superuser '{username}' già esistente. Nessuna azione eseguita."))
