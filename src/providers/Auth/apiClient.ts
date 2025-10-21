// providers/Auth/apiClient.ts (Create this new file)

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  body?: Record<string, any>
  token?: string | null
}

export const apiClient = async (endpoint: string, options: FetchOptions = {}) => {
  const { method = 'GET', body, token } = options

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // Add JWT for authenticated requests
  if (token) {
    headers['Authorization'] = `JWT ${token}`
  }

  const config: RequestInit = {
    method,
    headers,
    // Stringify the body only for POST/PUT requests
    body: body ? JSON.stringify(body) : undefined,
  }

  const response = await fetch(`/api/${endpoint}`, config)

  // Handle generic HTTP errors
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`

    try {
      const errorData = await response.json()

      // Handle different error formats
      if (errorData.errors && Array.isArray(errorData.errors) && errorData.errors.length > 0) {
        // Payload validation errors
        errorMessage = errorData.errors[0].message
      } else if (errorData.message) {
        // Standard error message
        errorMessage = errorData.message
      } else if (errorData.error) {
        // Alternative error format
        errorMessage = errorData.error
      }

      // Provide user-friendly messages for common errors
      if (response.status === 401) {
        if (endpoint.includes('login')) {
          errorMessage = 'Invalid email or password. Please try again.'
        } else {
          errorMessage = 'You are not authorized. Please login again.'
        }
      } else if (response.status === 403) {
        errorMessage = 'Access denied. You do not have permission to perform this action.'
      } else if (response.status === 404) {
        errorMessage = 'The requested resource was not found.'
      } else if (response.status === 500) {
        errorMessage = 'Server error. Please try again later.'
      }
    } catch (e) {
      // If response is not JSON, use status-based message
      if (response.status === 401 && endpoint.includes('login')) {
        errorMessage = 'Invalid email or password. Please try again.'
      }
    }

    throw new Error(errorMessage)
  }

  return response.json()
}
