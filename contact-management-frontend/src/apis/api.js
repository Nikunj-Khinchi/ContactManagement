import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000/api', // Replace with your backend URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getContacts = (params) => api.get('/contacts', { params });
export const createContact = (data) => api.post('/contacts', data);
export const updateContact = (id, data) => api.put(`/contacts/${id}`, data);
export const deleteContact = (id) => api.delete(`/contacts/${id}`);
