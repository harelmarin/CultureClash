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
import { useFonts } from 'expo-font';
import BottomNavBar from '../components/NavBar';

const HomeScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const { user } = useAuth();

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoText}>
          👤 {user?.username ?? 'Invité'} • ⭐ {user?.points ?? 0} pts
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>CultureClash</Text>
        <Text style={styles.subtitle}>Testez votre culture générale</Text>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('Room')}
        >
          <Text style={styles.playButtonText}>🎮 Jouer</Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar />
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
    opacity: 0.9,
  },
  playButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 35,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userInfoContainer: {
    position: 'absolute',
    top: 100,
    left: 40,
    backgroundColor: 'rgba(0,0,0,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  userInfoText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default HomeScreen;
