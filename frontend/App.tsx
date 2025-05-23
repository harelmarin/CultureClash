import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigator/authNavigator';
import { MainNavigator } from './src/navigator/mainNavigator';
import { AuthProvider, useAuth } from './src/contexts/authContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SocketProvider } from './src/contexts/socketContext';
import Toast from 'react-native-toast-message';

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <SafeAreaProvider initialMetrics={initialWindowMetrics}>
          <SocketProvider>
            <AppContent />
          </SocketProvider>
        </SafeAreaProvider>
      </AuthProvider>
      <Toast position="bottom" bottomOffset={60} />
    </QueryClientProvider>
  );
};

const AppContent = () => {
  const authContext = useAuth();
  const isAuthenticated = authContext?.isAuthenticated;
  const checkSession = authContext?.checkSession;

  useEffect(() => {
    checkSession && checkSession();
  }, [checkSession]);

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="#00c999" />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
