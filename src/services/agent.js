
const baseUrl =  "http://192.168.20.215:3400" //process.env.VUE_APP_BACKEND_URL
const cheqUrl = "https://b1api.burux.com/api/BRXIntLayer"
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
        'Accept': 'application/json'       
      }
      return config;
    },
    error => {
      Promise.reject(error)
  });

export const cheqAgent = axios.create({
  baseURL: cheqUrl
});
