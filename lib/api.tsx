import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// 1. Create a new Axios instance with a custom configuration
const apiClient = axios.create({
  // Use the environment variable for the base URL
  baseURL: process.env.EXPO_PUBLIC_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// 2. Set up an interceptor to automatically add the auth token to every request
apiClient.interceptors.request.use(
  async (config) => {
    // Use the new, correct function name: getItemAsync
    const token = await SecureStore.getItemAsync('token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request error
    return Promise.reject(error);
  }
);

// 3. Define and export the functions that will make the API calls

// === AUTHENTICATION ENDPOINTS ===
export const registerUser = (userData:any) => {
  return apiClient.post('/v0/api/user/register', userData);
};

export const loginUser = (credentials:any) => {
  return apiClient.post('/v0/api/user/login', credentials);
};

export const verifyEmail = (email:string) => {
  return apiClient.get(`/v0/api/user/verify-email?email=${email}`);
};


// === USER ENDPOINTS ===
export const getUserDetails = () => {
  return apiClient.get('/v0/api/user/me');
};

export const updateUserProfile = (updateData:any) => {
  return apiClient.put('/v0/api/user/me', updateData);
};


// === SCHEDULE ENDPOINTS ===
export const getMySchedules = () => {
    return apiClient.get('/v0/api/schedule/my-schedule');
};

export const createSchedule = (payload:any) => {
  return apiClient.post('/v0/api/schedule/create', payload);
};

// ... add more functions for every other API endpoint you have ...


// You can also export the client directly if you need to use it in a unique way
export default apiClient;



