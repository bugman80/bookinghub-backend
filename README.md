# BookingHub-Backend
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen)
![Django](https://img.shields.io/badge/Django-5.1.4-brightgreen)
![Django REST Framework](https://img.shields.io/badge/Django%20REST%20Framework-3.15.2-brightgreen)

BookingHub-Backend e' una applicazione backend che espone API RESTful per la gestione delle operazioni CRUD di Utenti, Hotels/B&B e dei relativi Servizi e Prenotazioni

---

## Indice

- [Introduzione](#introduzione)
- [Caratteristiche](#caratteristiche)
- [Prerequisiti](#prerequisiti)
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

## Prerequisiti

- **Git**
- **Docker**
- **Docker-Compose**

## Installazione

Segui questi passaggi per configurare l'applicazione in locale, questo comportera' clonare il repository backend, il repository frontend ed il repository contenente l'orchestratore dei servizi. I tre repository devono essere clonati nella stessa directory che avra' quindi la seguente struttura finale:

```
/bookinghub-dev-environment/   # Clone del repository di orchestrazione
|
├── docker-compose.yml
├── .env
└── README.md

/bookinghub-backend/           # Clone del repository backend
/bookinghub-frontend/          # Clone del repository frontend
```

### 1. Entra nella directory che hai scelto per contenere i tre repository di progetto

```bash
cd CartellaDiPreferenza
```

### 2. Clona il repository backend

```bash
git clone https://github.com/bugman80/bookinghub-backend.git
```

### 3. Clona il repository frontend

```bash
git clone https://github.com/bugman80/bookinghub-frontend.git
```

### 4. Clona il repository di orchestrazione e configura le variabili di ambiente

```bash
git clone https://github.com/bugman80/bookinghub-dev-environment.git
cd bookinghub-dev-environment
```
Crea un file `.env` nella root di questo repository (rifacendoti a `.env.example`) per definire le variabili di ambiente (le variabili relative a Gmail sono opzionali, se si vuole attivare l'invio di notifiche email e' necessario configurare un account Gmail esistente o crearne uno ad hoc e configurarlo: https://support.google.com/a/answer/176600?hl=en)

### 5. Costruisci e Avvia i Servizi

Esegui il seguente comando per costruire e avviare i servizi:

```bash
docker-compose up --build
```

Questo comando:
- Costruirà le immagini per backend e frontend
- Avvierà i servizi backend, frontend e il database PostgreSQL

### 6. Accedi ai Servizi

- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend (API)**: [http://localhost:8000](http://localhost:8000)
- **PostgreSQL**: Accessibile sulla porta `5432`

### 7. Arrestare i Servizi

Per arrestare i servizi, premi `Ctrl+C` o esegui:

```bash
docker-compose down
```

## Deployment

L'applicazione e' attualmente rilasciata automaticamente su Railway (https://railway.app/) ed e' disponibile all'indirizzo https://bookinghub-frontend-production.up.railway.app/

## Licenza

Nessuna licenza e' associata alla applicazione.