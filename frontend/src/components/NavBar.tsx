import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RoomScreenNavigationProp } from '../types/navigation';
import { logout } from '../services/authService';

const BottomNavBar = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const route = useRoute();

  const isActive = (screenName: string) => route.name === screenName;

  return (
    <View style={styles.navBar}>
      <TouchableOpacity
        style={[styles.navItem, isActive('Leaderboard') && styles.activeItem]}
        onPress={() => navigation.navigate('Leaderboard')}
      >
        <Ionicons
          name="trophy-outline"
          size={26}
          color={isActive('Leaderboard') ? '#fff' : '#eee'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('Friend') && styles.activeItem]}
        onPress={() => navigation.navigate('Friend')}
      >
        <Ionicons
          name="people-outline"
          size={26}
          color={isActive('Friend') ? '#fff' : '#eee'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('Home') && styles.activeItem]}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons
          name="home-outline"
          size={28}
          color={isActive('Home') ? '#fff' : '#eee'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.navItem, isActive('Profil') && styles.activeItem]}
        onPress={() => navigation.navigate('Profil')}
      >
        <Ionicons
          name="person-outline"
          size={26}
          color={isActive('Profil') ? '#fff' : '#eee'}
        />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} onPress={logout}>
        <Ionicons name="log-out-outline" size={26} color="#eee" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'rgba(0, 163, 135, 0.95)',
    flexDirection: 'row',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#ddd',
  },
  activeItem: {
    backgroundColor: '#6C63FF',
  },
});

export default BottomNavBar;
