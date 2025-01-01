
const baseUrl =  "https://backfinancial.burux.ir" //process.env.VUE_APP_BACKEND_URL "http://192.168.142.128:3400"//
const cheqUrl = "https://b1api.burux.com/api/BRXIntLayer"
const spreeUrl = "https://shopback.miarze.com/api/v2"
const spreeBrxUrl = "https://spree.burux.com/api/v2"
const spreeAuthUrl = "https://shopback.miarze.com"
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
  baseURL: spreeUrl
});
let spreeToken = null;
export const spreeBrxAgent = axios.create({
  baseURL: spreeBrxUrl
});
export const spreeNoAuthAgent = axios.create({
  baseURL: spreeAuthUrl
})
// Interceptor to add the Authorization header
spreeAgent.interceptors.request.use(
  async (config) => {
    if (!spreeToken) {
      await fetchToken(); // Automatically fetch token if not available
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${spreeToken}`,
    };

    return config;
  },
  (error) => Promise.reject(error)
);

// Function to retrieve a new token automatically
async function fetchToken() {
  try {
    
    const response = await spreeNoAuthAgent.post('spree_oauth/token', {
      username: '09124769630', // Replace with your client ID
      password: 'zbp@i2av', // Replace with your client secret
      grant_type: 'password',
      otp:""
    });

    if (response.data && response.data.access_token) {
      spreeToken = response.data.access_token;
      console.log('Token fetched successfully.');
    } else {
      throw new Error('Token not found in response');
    }
  } catch (error) {
    console.error('Failed to fetch token:', error.message);
    throw error;
  }
}
