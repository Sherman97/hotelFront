import api from './api';

// Catálogos de catálogo
export const getAccommodationsCatalog = () => api.get('/accommodations');
export const getRoomTypesCatalog = () => api.get('/room-types');

// Alias antiguos para retrocompatibilidad (si los usan)
export const getAccommodations = getAccommodationsCatalog;
export const getRooms = getRoomTypesCatalog;

// CRUD de catálogo de acomodaciones
export const createAccommodation = (data) => api.post('/accommodations', data);
export const updateAccommodation = (id, data) => api.put(`/accommodations/${id}`, data);
export const deleteAccommodation = (id) => api.delete(`/accommodations/${id}`);

// Hotel + asignaciones de acomodaciones (HotelRoom)
export const getHotelAndAccommodations = (hotelId) =>
  api.get(`/hotels/${hotelId}/accommodations`);

export const getHotelRooms = (hotelId) =>
  api.get(`/hotels/${hotelId}/rooms`);

export const createHotelRoom = (hotelId, payload) =>
  api.post(`/hotels/${hotelId}/rooms`, payload);

export const updateHotelRoom = (hotelId, roomId, payload) =>
  api.put(`/hotels/${hotelId}/rooms/${roomId}`, payload);

export const deleteHotelRoom = (hotelId, roomId) =>
  api.delete(`/hotels/${hotelId}/rooms/${roomId}`);
