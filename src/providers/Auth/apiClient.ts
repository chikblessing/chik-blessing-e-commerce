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
    const errorData = await response.json()
    const errorMessage =
      errorData.message || `Request to /api/${endpoint} failed with status ${response.status}`
    throw new Error(errorMessage)
  }

  return response.json()
}
