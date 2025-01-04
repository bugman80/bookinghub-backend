# BookingHub-Backend
![Python](https://img.shields.io/badge/Python-3.11+-brightgreen)
![Django](https://img.shields.io/badge/Django-5.1.4-brightgreen)
![Django REST Framework](https://img.shields.io/badge/Django%20REST%20Framework-3.15.2-brightgreen)

BookingHub-Backend e' una applicazione backend che espone API RESTful per la gestione delle operazioni CRUD di Utenti, Hotels/B&B e dei relativi Servizi e Prenotazioni

---

## Indice

- [Introduzione](#introduzione)
- [Caratteristiche](#caratteristiche)
- [Requisiti di sistema](#requisiti-di-sistema)
- [Installazione](#installazione)
- [Utilizzo](#utilizzo)
- [Test](#test)
- [Deployment](#deployment)
- [Licenza](#licenza)

---

## Introduzione

**BookingHub-Backend** rappresenta la componente backend di un progetto composto da backend e frontend (https://github.com/bugman80/bookinghub-frontend), per facilitare il setup e run dell'ambiente di sviluppo e' stato creato un repository dedicato al docker-compose che consente di orchestrare entrambi i layer ed il database PostgreSQL (https://github.com/bugman80/bookinghub-dev-environment)

## Caratteristiche

- set di modelli Django per la gestione di Utenti, Hotel, Servizi e Prenotazioni
- set di API RESTful create con Django REST Framework per le operazioni CRUD sui modelli
- sistema di notifica email per gli utenti registrati utilizzando il server SMTP di Gmail
- script per la inizializzazione del database e la creazione di un superuser

## Requisiti di sistema

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

### Entra nella directory che hai scelto per contenere i tre repository di progetto

```bash
cd CartellaDiPreferenza
```

### Clona il repository backend

```bash
git clone https://github.com/bugman80/bookinghub-backend.git
```

### Clona il repository frontend

```bash
git clone https://github.com/bugman80/bookinghub-frontend.git
```

### Clona il repository di orchestrazione e avvia i servizi

```bash
git clone https://github.com/bugman80/bookinghub-dev-environment.git
cd bookinghub-dev-environment
```
e' necessario ora creare il proprio file .env ed a tale scopo e' presente un file .env.example da usare come riferimento, quindi si puo' procedere ad avviare i servizi:

```bash
docker-compose up
```

## Utilizzo

L'utilizzo della applicazione per ora e' limitato a un numero di utenti minimo.

## Test

L'applicazione presenta una suite di tests che vengono eseguiti tramite GitHub actions.

## Deployment

L'applicazione e' momentaneamente rilasciata su Railway (https://railway.app/).

## Licenza

Nessuna licenza e' associata alla applicazione.