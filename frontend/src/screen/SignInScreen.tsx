import { View, StyleSheet, Button, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import RegisterForm from '../components/forms/RegisterFrom';

const SignInScreen = () => {
  return (
    <View style={styles.container}>
      <RegisterForm />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default SignInScreen;
