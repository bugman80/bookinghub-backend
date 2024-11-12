# BookingHub

![Django REST Framework](https://img.shields.io/badge/Django%20REST%20Framework-3.12+-brightgreen)
![React](https://img.shields.io/badge/React-17+-brightgreen)

BookingHub e' una applicazione web ideata per gestire le operazione di CRUD di Hotels/B&B e delle relative prenotazioni

---

## Indice

- [Introduzione](#introduzione)
- [Caratteristiche](#caratteristiche)
- [Requisiti](#requisiti)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Test](#test)
- [Deployment](#deployment)
- [Licenza](#licenza)

---

## Introduzione

**BookingHub** è una piattaforma per la prenotazione online di hotels. Questo progetto sfrutta Django REST Framework per il backend e React per il frontend e prevede due ruoli applicativi principali guest e admin.

## Caratteristiche

- API RESTful create con Django REST Framework
- Interfaccia utente dinamica sviluppata con React

## Requisiti

- **Python** 3.12+
- **Node.js** 20+
- **Git**

## Installazione

Segui questi passaggi per configurare l'applicazione in locale, l'hosting del codice sorgente e' su github (https://github.com/bugman80/bookinghub).

### Clona il repository

```bash
git clone https://github.com/username/NomeProgetto.git
cd NomeProgetto
```

### Crea un virtualenv

Questo step prevede che python 3 sia installato sulla macchina, dopodiche' si puo' procedere a create un virtualenv per il progetto e ad attivarlo

```bash
python -m venv bookinghub_env
source ./bookinghub_env/bin/activate
```
### Installa le dipendenze per python

```bash
pip install -r requirements.txt
```
### Crea il database, il superuser e fa partire il server di sviluppo

```bash
./manage.py migrate
./manage.py create_superuser_if_not_exists
./manage.py runserver
```

### Installa le dipendenze frontend e fa partire il frontend

```bash
cd hotel-booking-frontend
npm install
npm run
```

## Utilizzo

L'utilizzo della applicazione per ora e' limitato a un numero di utenti minimo.

## Test

L'applicazione presenta una suite di tests sia backend che frontend che vengono eseguiti tramite GitHub actions.

## Deployment

L'applicazione e' momentaneamente rilasciata su Render (https://render.com/).

## Licenza

Nessuna licenza e' associata alla applicazione.