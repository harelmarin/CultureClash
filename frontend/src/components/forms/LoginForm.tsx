import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { login, checkSession } from '../../services/authService';
import { useAuth } from '../../contexts/authContext';
import { useFonts } from 'expo-font';
import Toast from 'react-native-toast-message'; // Importation de Toast

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginForm = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setIsAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useFonts({
    Modak: require('../../assets/font/Modak-Regular.ttf'),
  });

  const handleLogin = async () => {
    setLoading(true);
    const loginData = { username, password };
    const success = await login(loginData);
    setLoading(false);

    if (success) {
      const sessionValid = await checkSession();
      if (sessionValid) {
        setIsAuthenticated(true);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Session invalide',
          text2: 'Veuillez vous reconnecter.',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Échec de la connexion',
        text2: 'Vérifiez vos identifiants.',
      });
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      {/** 
      <LottieView
        source={require('../../assets/animation/brain.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      */}
      <Text style={styles.title}>CultureClash</Text>
      <Text style={styles.subtitle}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="rgba(255,255,255,0.8)"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="rgba(255,255,255,0.8)"
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Connexion...' : 'Se connecter'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.registerContainer}
        onPress={handleRegister}
      >
        <Text style={styles.registerText}>
          Pas encore de compte ? S'inscrire
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00c999',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  animation: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 42,
    fontFamily: 'Modak',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 20,
    color: '#fff',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.8)',
    marginVertical: 10,
    fontSize: 18,
    color: '#fff',
    paddingVertical: 8,
  },
  button: {
    width: '100%',
    backgroundColor: '#6C63FF',
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonDisabled: {
    backgroundColor: '#6C63FF80',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    textAlign: 'center',
  },
  registerContainer: {
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default LoginForm;
