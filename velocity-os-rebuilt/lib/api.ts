import { getIdToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Fetch wrapper that includes authentication headers
 */
export async function fetchWithAuth(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = await getIdToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Merge with any additional headers from options
  if (options.headers) {
    const optHeaders = new Headers(options.headers);
    optHeaders.forEach((value, key) => {
      headers[key] = value;
    });
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Handle unauthorized responses
    if (response.status === 401) {
      // Redirect to login on unauthorized
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new Error('Unauthorized');
    }

    return response;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

/**
 * API client methods
 */
export const api = {
  get: async (endpoint: string) => {
    const response = await fetchWithAuth(endpoint, { method: 'GET' });
    return response.json();
  },

  post: async (endpoint: string, data: any) => {
    const response = await fetchWithAuth(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  put: async (endpoint: string, data: any) => {
    const response = await fetchWithAuth(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response.json();
  },

  delete: async (endpoint: string) => {
    const response = await fetchWithAuth(endpoint, { method: 'DELETE' });
    return response.json();
  },
};
