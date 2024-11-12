import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Crea un'istanza di Axios e la configura per puntare al backend
const client = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
});

// Funzione per gestire il refresh del token
async function refreshToken() {
    const refresh = localStorage.getItem('refresh');
    try {
        const response = await client.post('api/token/refresh/', { refresh });
        localStorage.setItem('access', response.data.access); // Aggiorna il nuovo access token
        return response.data.access;
    } catch (error) {
        console.error('Errore durante il refresh del token:', error);
        // Se il refresh fallisce, puoi decidere di fare il logout dell'utente
        localStorage.removeItem('access');
        localStorage.removeItem('refresh');
        return null;
    }
}

// Interceptor per aggiungere l'access token a tutte le richieste
client.interceptors.request.use(config => {
    const access = localStorage.getItem('access');
    if (access) {
        config.headers['Authorization'] = `Bearer ${access}`;
    }
    return config;
});

// Interceptor per gestire errori di risposta (ad esempio, token scaduto)
client.interceptors.response.use(
    response => response,
    async error => {
        const originalRequest = error.config;
        if (error.response && (error.response.status === 401 || error.response.status === 403) && !originalRequest._retry) {
            // Evita il ciclo infinito
            originalRequest._retry = true;

            const newAccessToken = await refreshToken();
            if (newAccessToken) {
                // Aggiorna l'access token e riprova la richiesta originale
                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
                return client(originalRequest);
            } else {
                const navigate = useNavigate();
                navigate('/login');
            }
        }
        
        // Se il refresh fallisce propaga l'errore
        return Promise.reject(error);
    }
);

export default client;
