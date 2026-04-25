import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mocking some delay to show loading states
api.interceptors.response.use(async (response) => {
  await new Promise(resolve => setTimeout(resolve, 800));
  return response;
});

export default api;
