// API base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to convert snake_case to camelCase
function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toCamelCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      result[camelKey] = toCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

// Helper function to convert camelCase to snake_case
function toSnakeCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(v => toSnakeCase(v));
  } else if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      result[snakeKey] = toSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
      throw new ApiError(
        response.status,
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    return toCamelCase(data) as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new Error(`Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export const api = {
  get: <T>(endpoint: string) => request<T>(endpoint, { method: 'GET' }),
  
  post: <T>(endpoint: string, data: any) =>
    request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(toSnakeCase(data)),
    }),
  
  put: <T>(endpoint: string, data: any) =>
    request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(toSnakeCase(data)),
    }),
  
  delete: (endpoint: string) =>
    request(endpoint, { method: 'DELETE' }),
};

