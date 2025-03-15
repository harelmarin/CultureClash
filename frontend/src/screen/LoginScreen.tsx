import { View, StyleSheet } from 'react-native';
import React from 'react';
import LoginForm from '../components/forms/LoginForm';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <LoginForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default LoginScreen;
