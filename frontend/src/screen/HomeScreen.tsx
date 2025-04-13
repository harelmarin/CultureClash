import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Platform,
  Image,
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
      <View style={styles.userProfileBox}>
        <Image style={styles.avatar} />
        <View>
          <Text style={styles.userName}>{user?.username ?? 'Invité'}</Text>
          <Text style={styles.userPoints}>⭐ {user?.points ?? 0} pts</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>CultureClash</Text>
        <Text style={styles.subtitle}>Testez votre culture générale</Text>

        <TouchableOpacity
          style={styles.playButton}
          onPress={() => navigation.navigate('Room')}
        >
          <Text style={styles.playButtonText}>🎮 Jouer maintenant</Text>
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
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  userProfileBox: {
    position: 'absolute',
    top: 100,
    left: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    backgroundColor: '#eee',
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userPoints: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default HomeScreen;

