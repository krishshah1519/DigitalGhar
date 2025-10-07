import axios from 'axios';

const api_public = axios.create({
    baseURL: '/api',
});

export default api_public;