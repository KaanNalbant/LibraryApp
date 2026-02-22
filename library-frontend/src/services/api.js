import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const PublisherService = {
  getAll: () => api.get('/publishers'),
  getById: (id) => api.get(`/publishers/${id}`),
  create: (data) => api.post('/publishers', data),
  update: (id, data) => api.put(`/publishers/${id}`, data),
  delete: (id) => api.delete(`/publishers/${id}`),
};

export const CategoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
};

export const AuthorService = {
  getAll: () => api.get('/authors'),
  getById: (id) => api.get(`/authors/${id}`),
  create: (data) => api.post('/authors', data),
  update: (id, data) => api.put(`/authors/${id}`, data),
  delete: (id) => api.delete(`/authors/${id}`),
};

export const BookService = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (data) => api.post('/books', data),
  update: (id, data) => api.put(`/books/${id}`, data),
  delete: (id) => api.delete(`/books/${id}`),
  getByCategoryId: (id) => api.get(`/books/category/${id}`),
};

export const BookBorrowingService = {
  getAll: () => api.get('/borrowings'),
  getById: (id) => api.get(`/borrowings/${id}`),
  create: (data) => api.post('/borrowings', data),
  update: (id, data) => api.put(`/borrowings/${id}`, data),
  delete: (id) => api.delete(`/borrowings/${id}`),
};

export default api;
