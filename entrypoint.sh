#!/bin/bash

# Aspetto che il db sia disponibile
python manage.py wait_for_db

# Eseguo le migrazioni
python manage.py migrate

# Eseguo il comando di gestione personalizzato
python manage.py create_superuser_if_not_exists

# Avvio il server
python manage.py runserver 0.0.0.0:8000
