
const baseUrl = 'http://192.168.1.80:3400'
const axios = require('axios');
export const finAgent = axios.create({

  baseURL: `${baseUrl}/api`
}
);

// Request interceptor for API calls
finAgent.interceptors.request.use(
    async config => {

      config.headers = { 
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'Accept': 'application/json',
       
      }
      return config;
    },
    error => {
      Promise.reject(error)
  });
