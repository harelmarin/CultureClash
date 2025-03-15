import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  clearSession,
  getSession,
  refreshSession,
  getMe, // Import de la nouvelle fonction
} from '../services/authService';

export type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  setIsAuthenticated: (value: boolean) => void;
  checkSession: () => Promise<boolean>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  const checkSession = async () => {
    const sessionId = await getSession();
    if (!sessionId) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }

    const isSessionValid = await refreshSession();
    if (isSessionValid) {
      setIsAuthenticated(true);
      await refreshUser();
      return true;
    } else {
      await clearSession();
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }
  };

  const refreshUser = async () => {
    const userData = await getMe();
    if (userData) {
      setUser(userData);
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    checkSession();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        setIsAuthenticated,
        checkSession,
        refreshUser,
      }}
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
