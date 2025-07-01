import api from './api';

export const getHotels = () => api.get('/hotels');
export const createHotel = (data) => api.post('/hotels', data);
export const getHotel = (id) => api.get(`/hotels/${id}`);

export const updateHotel = (id, data) => api.put(`/hotels/${id}`, data);
export const deleteHotel = (id) => api.delete(`/hotels/${id}`);
