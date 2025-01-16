import { mainStore } from "../stores/store"

// Instead of initializing store immediately, create a function to get the token
const getToken = () => {
  const store = mainStore()
  return store.token
}

export const API_URL = "http://talkiez-api.test/api"

// add user.token as bearer auth header

export const apiGet = async (endpoint, params = {}, headers = {}) => {
  const urlParams = new URLSearchParams(params)
  const queryString = urlParams.toString()
  const url = `${API_URL}${endpoint}${queryString ? "?" + queryString : ""}`
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...headers,
    },
  })
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch (e) {
    console.error(`[API] ${endpoint} | params: ${JSON.stringify(params)} | Error: ${e} | Response:`, text)
    return {}
  }
}

export const apiPost = async (endpoint, data = {}, headers = {}, responseType = "json") => {
  // Don't stringify if data is FormData
  const body = data instanceof FormData ? data : JSON.stringify(data)

  // Remove Content-Type if it's FormData (browser will set it automatically)
  const defaultHeaders = {
    Accept: "application/json",
    Authorization: `Bearer ${getToken()}`,
  }

  // Only add Content-Type for JSON requests
  if (!(data instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    method: "POST",
    headers: {
      ...defaultHeaders,
      ...headers,
    },
    body,
  })

  // If response is not ok, handle the error
  if (!response.ok) {
    const errorText = await response.text()
    let parsedError
    try {
      parsedError = JSON.parse(errorText)
    } catch (e) {
      parsedError = { message: errorText }
    }

    const error = {
      status: response.status,
      data: parsedError,
      message: parsedError.message || "API request failed",
      errors: parsedError.errors || {},
    }

    console.error(`[API] ${endpoint} | Request failed:`, error)
    throw error
  }

  // Handle different response types
  if (responseType === "blob") {
    return response.blob()
  }

  if (responseType === "arrayBuffer") {
    return response.arrayBuffer()
  }

  // Default JSON handling
  const text = await response.text()
  try {
    return JSON.parse(text)
  } catch (e) {
    console.error(`[API] ${endpoint} | Invalid JSON response:`, e)
    throw new Error("Invalid response format from server")
  }
}
