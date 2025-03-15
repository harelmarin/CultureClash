import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { login, checkSession } from '../../services/authService';
import { useAuth } from '../../contexts/authContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

const LoginForm = () => {
  const navigation = useNavigation<NavigationProp>();
  const { setIsAuthenticated } = useAuth();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    const loginData = { username, password };
    const success = await login(loginData);

    setLoading(false);

    if (success) {
      console.log('Connexion réussie');
      const sessionValid = await checkSession();
      if (sessionValid) {
        console.log('Redirection vers MainNavigator');
        setIsAuthenticated(true); // ✅ Correctement mis à jour
      } else {
        setError('La session est invalide. Veuillez vous reconnecter.');
      }
    } else {
      setError('Échec de la connexion. Vérifiez vos identifiants.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connexion</Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        title={loading ? 'Connexion...' : 'Se connecter'}
        onPress={handleLogin}
        disabled={loading}
      />

      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerText}>Pas encore inscrit ? S'inscrire</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default LoginForm;
