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
import { Ionicons } from '@expo/vector-icons';

const HomeScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const { user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Salut, {user?.username} 👋</Text>
        <TouchableOpacity style={styles.iconButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={24} color="#FF4B5C" />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContent}>
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
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => navigation.navigate('Friend')}
        >
          <Ionicons name="people-outline" size={22} color="white" />
          <Text style={styles.socialButtonText}>Social</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
  },
  welcomeText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  iconButton: {
    padding: 8,
    backgroundColor: '#FFE4E6',
    borderRadius: 50,
  },
  mainContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: '#3B82F6',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 18,
    color: '#4B5563',
    textAlign: 'center',
  },
  gameContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  gameText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '500',
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 50,
    width: '100%',
    maxWidth: 300,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10B981',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 50,
    maxWidth: 250,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  socialButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default HomeScreen;
