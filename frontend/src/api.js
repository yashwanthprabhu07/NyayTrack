import axios from 'axios';

const API = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
});

export const uploadPDF = (formData) => API.post('/upload', formData);
export const getActions = () => API.get('/actions');
export const getAction = (id) => API.get('/actions/' + id);
export const updateStatus = (id, status) => API.patch('/actions/' + id + '/status?status=' + status);
export const searchCase = (caseNumber) => API.get('/actions/search/' + caseNumber);

export default API;
