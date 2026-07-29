import axios from 'axios';

// `serve -s build` no aplica el proxy de Create React App; las peticiones
// relativas deben dirigirse explícitamente al backend y no al puerto 3000.
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || `${window.location.protocol}//${window.location.hostname}:5000`,
});

export default api;
