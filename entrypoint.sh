#!/bin/bash

# Aspetto che il db sia disponibile
python manage.py wait_for_db

# Eseguo le migrazioni
python manage.py migrate

# Eseguo il collectstatic
python manage.py collectstatic --noinput

# Eseguo il comando di gestione personalizzato
python manage.py create_superuser_if_not_exists

# Avvio il server
exec gunicorn bookinghub.wsgi:application --workers 4 --threads 2 --bind 0.0.0.0:8000
