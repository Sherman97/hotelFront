import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api-hotel-01nz.onrender.com/api', // Ajusta si es necesario
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;