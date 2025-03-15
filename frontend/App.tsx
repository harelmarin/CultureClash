import React, { useEffect } from 'react';
import { View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import { AuthNavigator } from './src/navigator/authNavigator';
import { MainNavigator } from './src/navigator/mainNavigator';
import { AuthProvider, useAuth } from './src/contexts/authContext';

const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <AppContent />
      </SafeAreaProvider>
    </AuthProvider>
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
      <StatusBar style="light" />
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default App;
