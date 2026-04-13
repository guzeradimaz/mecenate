import axios from 'axios';

const BASE_URL = 'https://k8s.mectest.ru/test-app';

// Any valid UUID works as auth token per the API spec
const USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${USER_ID}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  },
);
