import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import { register } from '../../services/authService';
import { useFonts } from 'expo-font';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;

const RegisterForm = () => {
  const navigation = useNavigation<NavigationProp>();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useFonts({
    Modak: require('../../assets/font/Modak-Regular.ttf'),
  });

  const handleRegister = async () => {
    setError('');
    setLoading(true);

    const registerData = { email, username, password };
    const success = await register(registerData);

    setLoading(false);

    if (success) {
      setEmail('');
      setUsername('');
      setPassword('');
      navigation.navigate('Login');
    } else {
      setError(
        "Erreur lors de l'inscription. Veuillez vérifier vos informations.",
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <Text style={styles.subtitle}>Créez votre compte</Text>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="rgba(255,255,255,0.8)"
        />
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
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Chargement...' : "S'inscrire"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginContainer}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.loginText}>Déjà inscrit ? Se connecter</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00c999',
  },
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
    textAlign: 'center',
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
  errorText: {
    color: '#FF6B6B',
    marginVertical: 8,
    textAlign: 'center',
  },
  loginContainer: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#fff',
    textDecorationLine: 'underline',
  },
});

export default RegisterForm;
