import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4440',
});

export default api;
