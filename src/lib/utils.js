import { mainStore } from '../stores/store';

// Instead of initializing store immediately, create a function to get the token
const getToken = () => {
  const store = mainStore();
  return store.token;
};

export const API_URL = "http://talkiez-api.test/api"

// add user.token as bearer auth header

export const apiGet = async (endpoint, params = {}, headers = {}) => {
  const urlParams = new URLSearchParams(params);
  const queryString = urlParams.toString();
  const url = `${API_URL}${endpoint}${queryString ? '?' + queryString : ''}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
      ...headers
    }
  });
  const text = await response.text();
  
  try {
    return JSON.parse(text);
  } catch (e) {
    console.error(`[API] ${endpoint} | params: ${JSON.stringify(params)} | Error: ${e} | Response:`, text);
    return {};
  }
}



export const apiPost = async (endpoint, data = {}, headers = {}) => {
  // Don't stringify if data is FormData
  const body = data instanceof FormData ? data : JSON.stringify(data);
  
  // Remove Content-Type if it's FormData (browser will set it automatically)
  const defaultHeaders = {
    'Accept': 'application/json',
    'Authorization': `Bearer ${getToken()}`,
  };
  
  // Only add Content-Type for JSON requests
  if (!(data instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...defaultHeaders,
      ...headers
    },
    body
  });
  
  let parsedResponse;
  try {
    // First, try to parse the JSON response
    parsedResponse = JSON.parse(await response.text());
  } catch (e) {
    // Handle JSON parsing errors
    console.error(`[API] ${endpoint} | Invalid JSON response:`, e);
    throw new Error('Invalid response format from server');
  }

  // If response is not ok, format and throw the error
  if (!response.ok) {
    const error = {
      status: response.status,
      data: parsedResponse,
      message: parsedResponse.message || 'API request failed',
      errors: parsedResponse.errors || {}
    };
    
    console.error(`[API] ${endpoint} | Request failed:`, error);
    throw error;
  }

  return parsedResponse;
}
