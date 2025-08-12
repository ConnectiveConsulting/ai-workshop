import axios from 'axios';

// Create an Axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5214/api', // Adjusted to match the .NET Core API URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add a request interceptor for handling common request tasks
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens or other request modifications here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor for handling common response tasks
api.interceptors.response.use(
  (response) => {
    // You can transform response data here if needed
    return response;
  },
  (error) => {
    // Handle common errors (e.g., 401 Unauthorized, 403 Forbidden)
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        console.error('Unauthorized access');
        // Handle unauthorized access (e.g., redirect to login)
      } else if (status === 403) {
        console.error('Forbidden access');
        // Handle forbidden access
      } else if (status === 404) {
        console.error('Resource not found');
        // Handle not found
      } else if (status >= 500) {
        console.error('Server error');
        // Handle server errors
      }
    } else if (error.request) {
      console.error('No response received from server');
      // Handle network errors
    } else {
      console.error('Error setting up request', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;