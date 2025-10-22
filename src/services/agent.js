
const baseUrl ="https://backfinancial.burux.ir" //"http://192.168.192.129:3400"  //"https://backfinancial.burux.ir" //process.env.VUE_APP_BACKEND_URL ""//
const cheqUrl = "https://b1api.burux.com/api/BRXIntLayer"
const spreeUrl = "https://shopback.miarze.com/api/v2" //"https://shopback.miarze.com/api/v2"
const spreeBrxUrl = "https://spree.burux.com/api/v2" //"https://spree.burux.com/api/v2"
const spreeBbetaAuthUrl ="http://192.168.192.129:4500" // "https://shopback.bbeta.ir"
const spreeBbetaUrlV3 = "http://192.168.192.129:4500/api/v3" //"https://shopback.bbeta.ir/api/v3"
const spreeAuthUrl = "https://shopback.miarze.com"//"https://shopback.miarze.com"
const spreeUrlV3 = "https://shopback.miarze.com/api/v3"
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
let spreePlatfotmToken = null;
export const spreeBrxAgent = axios.create({
  baseURL: spreeBrxUrl
});
export const spreeNoAuthAgent = axios.create({
  baseURL: spreeAuthUrl
})
export const spreeNoAuthAgentBbeta = axios.create({
  baseURL: spreeAuthUrl
})
export const spreePAgent = axios.create({
  baseURL: spreeUrlV3
});
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
spreePAgent.interceptors.request.use(
    async (config) => {
      spreePlatfotmToken = localStorage.getItem('platformToken')

    if (!spreePlatfotmToken) {
      await fetchPlatformToken(); // Automatically fetch token if not available
    }

    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${spreePlatfotmToken}`,
    };

    return config;
  },
  (error) => Promise.reject(error)
)
// Function to retrieve a new token automatically
export async function fetchPlatformToken() {
  try {
    const response = await spreeNoAuthAgentBbeta.post('spree_oauth/token', {
      client_id: "47WfmNFqpNeabriIqr5bxni4WwTsA7ExoHHp54m1R5o", // Replace with your client ID
      client_secret: "Oh8dVr4u-MHWK9Ay-fmUT0FwkNE9pGgsSURtNY-2p30", // Replace with your client secret"": 
      grant_type: 'client_credentials',
      scope: "admin"
    });
    //test bbeta
    // "uQ-WCFFhe-PM71mfL_x0el2BJMkUjcfNSnNcZ1j4ZVA"
    // "04LiRdaFSDDGJmnJqtCiHt2MFpbjDtk7FB6nTQuj_B0"
    //testlocal
//			  "client_id": "vtHOJfnqARHojkzTqJD_hzj1jhlpUpJ2HiOr9RX9x8I",
//"client_secret": "F64OYF2ByO2Uiqndh0kiv5L1de17dVEkdebBWf41k4o",
//main
     //client_id: "47WfmNFqpNeabriIqr5bxni4WwTsA7ExoHHp54m1R5o", // Replace with your client ID
      //client_secret: "Oh8dVr4u-MHWK9Ay-fmUT0FwkNE9pGgsSURtNY-2p30"
    if (response.data && response.data.access_token) {
      spreePlatfotmToken = response.data.access_token;
      localStorage.setItem('platformToken',spreePlatfotmToken )
      console.log('Token fetched successfully.');
    } else {
      throw new Error('Token not found in response');
    }
  } catch (error) {
    console.error('Failed to fetch token:', error.message);
    throw error;
  } 
}
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
