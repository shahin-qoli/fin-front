
const baseUrl =  "https://backfinancial.burux.ir" //process.env.VUE_APP_BACKEND_URL
const cheqUrl = "https://b1api.burux.com/api/BRXIntLayer"
const spreeUrl = "https://shopback.miarze.com/api/v2"
// const spreeToken = "f13d8dc23f4e4d8b1798199b21b112d8f567c95248d8729bbaac96acefec6852"
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

export const spreeAgent = axios.create({
  baseURL: spreeUrl,
  headers: { 
    'Authorization': 'Bearer 8f1f5beff42e9cefa3a2d75bb29613ad74c5b4bae80ee80e69838dbfbfa08fd2'
  }
});

// spreeAgent.interceptors.request.use(
//     async config => {
//       config.headers = {
//         'Authorization': `Bearer ${spreeToken}`
//       }
//     },
    
//     error => {
//       Promise.reject(error)
//   }

// )
