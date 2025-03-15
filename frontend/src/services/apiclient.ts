import { refreshSession } from './authService';

const BASE_URL = 'http://localhost:3000';

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: any;
  credentials?: RequestCredentials;
  retryOnAuthFail?: boolean;
};

export const apiClient = async <T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> => {
  const {
    method = 'GET',
    headers,
    body,
    credentials = 'include',
    retryOnAuthFail = true,
  } = options;

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
      credentials,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);

      if (response.status === 401 && retryOnAuthFail) {
        console.warn(`Session expirée, tentative de récupération...`);
        const refreshed = await refreshSession();
        if (refreshed) {
          return apiClient<T>(endpoint, { ...options, retryOnAuthFail: false });
        }
      }

      throw new Error(
        errorData?.message ||
          `Erreur ${response.status}: ${response.statusText} pour ${method} ${endpoint}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
};
