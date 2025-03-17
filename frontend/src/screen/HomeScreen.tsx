import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RoomScreenNavigationProp } from '../types/navigation';
import { useAuth } from '../contexts/authContext';
import { logout } from '../services/authService';

const HomeScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Bienvenue, {user?.username}</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Déconnexion</Text>
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Friend')}
        >
          <Text style={styles.startButtonText}>Social</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Text style={styles.title}>Culture Clash</Text>
          <Text style={styles.subtitle}>Quiz de Culture Générale</Text>
        </View>

        <View style={styles.gameContainer}>
          <Text style={styles.gameText}>Prêt à tester vos connaissances ?</Text>
          <TouchableOpacity
            style={styles.startButton}
            onPress={() => navigation.navigate('Room')}
          >
            <Text style={styles.startButtonText}>Commencer le Quiz</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  welcomeText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  logoutButton: {
    padding: 8,
    borderRadius: 15,
    backgroundColor: '#FF6B6B',
  },
  logoutText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: Platform.select({ ios: '800', android: 'bold' }),
    color: '#6C63FF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
  },
  gameContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  gameText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 30,
    textAlign: 'center',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    width: '100%',
    maxWidth: 300,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
    textAlign: 'center',
  },
});

export default HomeScreen;
