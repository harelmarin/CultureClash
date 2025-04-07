import { LoginData, RegisterData } from '../types/authTypes';
import { User } from '../types/userTypes';
import { IP_PC } from '../../config';

const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

let currentSessionId: string | null = null;

export const refreshSession = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${IP_PC}/auth/refresh-session`, {
      method: 'GET',
      headers: {
        'X-Session-ID': currentSessionId || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      return true;
    }

    console.warn('Impossible de refresh la session');
    return false;
  } catch (error) {
    console.error('Erreur lors du refresh de session:', error);
    return false;
  }
};

export const register = async (
  registerData: RegisterData,
): Promise<boolean> => {
  try {
    const response = await fetch(`${IP_PC}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
      credentials: 'include',
    });

    if (response.ok) {
      const responseData = await response.json();

      console.log('Utilisateur enregistré avec succès');
      console.log(responseData);

      return true;
    } else {
      const errorData = await response.json();
      console.warn("Erreur d'inscription:", errorData.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return false;
  }
};

export const login = async (loginData: LoginData): Promise<boolean> => {
  try {
    currentSessionId = generateSessionId();
    const response = await fetch(`${IP_PC}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Session-ID': currentSessionId,
      },
      body: JSON.stringify(loginData),
      credentials: 'include',
    });
    if (response.ok) {
      const responseData = await response.json();
      console.log('Utilisateur login');
      console.log(responseData);
      return true;
    } else {
      const errorData = await response.json();
      console.warn("Erreur d'inscription:", errorData.message);
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return false;
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${IP_PC}/auth/logout`, {
      method: 'POST',
      headers: {
        'X-Session-ID': currentSessionId || '',
      },
      credentials: 'include',
    });
    if (response.ok) {
      currentSessionId = null;
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return false;
  }
};

export const checkSession = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${IP_PC}/auth/check-session`, {
      method: 'GET',
      headers: {
        'X-Session-ID': currentSessionId || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const user = await response.json();
      console.log('Utilisateur connecté:', user);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const getSession = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${IP_PC}/auth/me`, {
      method: 'GET',
      headers: {
        'X-Session-ID': currentSessionId || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      throw new Error('Utilisateur non connecté');
    }
  } catch (error) {
    return null;
  }
};

export const clearSession = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${IP_PC}/auth/clear-session`, {
      method: 'POST',
      headers: {
        'X-Session-ID': currentSessionId || '',
      },
      credentials: 'include',
    });

    if (response.ok) {
      currentSessionId = null;
      return true;
    } else {
      console.error("Erreur lors de l'effacement de la session");
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la destruction de la session:', error);
    return false;
  }
};

export const getMe = async (): Promise<User | null> => {
  try {
    const response = await fetch(`${IP_PC}/auth/me`, {
      method: 'GET',
      headers: {
        'X-Session-ID': currentSessionId || '',
      },
      credentials: 'include',
    });
    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      throw new Error('Utilisateur non connecté');
    }
  } catch (error) {
    return null;
  }
};
