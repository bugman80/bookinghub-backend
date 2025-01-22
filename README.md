# BookingHub-Backend
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen)
![Django](https://img.shields.io/badge/Django-5.1.5-brightgreen)
![Django REST Framework](https://img.shields.io/badge/Django%20REST%20Framework-3.15.2-brightgreen)

BookingHub-Backend e' una applicazione backend che espone API RESTful per la gestione delle operazioni CRUD di Utenti, Hotels/B&B e dei relativi Servizi e Prenotazioni

---

## Indice

- [Introduzione](#introduzione)
- [Caratteristiche](#caratteristiche)
- [Installazione](#installazione)
- [Deployment](#deployment)
- [Licenza](#licenza)

---

## Introduzione

**BookingHub-Backend** rappresenta la componente backend di un progetto composto da backend e frontend (https://github.com/bugman80/bookinghub-frontend), per facilitare il setup e run dell'ambiente di sviluppo e' stato creato un repository contenente un docker-compose che consente di orchestrare entrambi i layer ed il database PostgreSQL (https://github.com/bugman80/bookinghub-dev-environment)

## Caratteristiche

- set di modelli Django per la gestione di Utenti, Hotel, Servizi e Prenotazioni
- set di API RESTful create con Django REST Framework per le operazioni CRUD sui modelli
- sistema di notifica email per gli utenti registrati utilizzando il server SMTP di Gmail (opzionale)
- script per la inizializzazione del database e la creazione di un superuser

## Installazione

Per l'installazione utilizzare le istruzioni contenute nel repository dell'orchestratore https://github.com/bugman80/bookinghub-dev-environment

## Deployment

L'applicazione e' attualmente rilasciata automaticamente su Railway (https://railway.app/) ed e' disponibile all'indirizzo https://bookinghub-backend-production.up.railway.app/admin/

## Licenza

Nessuna licenza e' associata alla applicazione.