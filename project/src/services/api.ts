import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // Proxy do Vite para o backend
  withCredentials: true, // Envia credenciais para httpBasic
  auth: {
    username: 'user',
    password: 'password',
  }, // Credenciais em memória do backend
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Não autorizado. Verifique usuário/senha.');
    }
    if (error.response?.status === 400) {
      console.error('Erro de validação (400):', error.response.data);
      console.error('Dados enviados:', error.config?.data);
    }
    if (error.response?.status === 500) {
      console.error('Erro interno do servidor.');
    }
    return Promise.reject(error);
  }
);

export default api;