import React, { createContext, useState, useContext } from 'react';
import {
  clearSession,
  getSession,
  refreshSession,
} from '../services/authService';

export type AuthContextType = {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  checkSession: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkSession = async () => {
    const sessionId = await getSession();
    if (!sessionId) {
      setIsAuthenticated(false);
      return false;
    }

    const isSessionsValid = await refreshSession();
    if (isSessionsValid) {
      setIsAuthenticated(true);
      return true;
    } else {
      await clearSession();
      setIsAuthenticated(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setIsAuthenticated, checkSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
