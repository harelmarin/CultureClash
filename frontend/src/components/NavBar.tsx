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
      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons
          name="trophy-outline"
          size={26}
          color={isActive('Leaderboard') ? '#6C63FF' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Friend')}>
        <Ionicons
          name="people-outline"
          size={26}
          color={isActive('Friend') ? '#6C63FF' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <View
          style={[
            styles.homeButton,
            isActive('Home') && styles.homeButtonActive,
          ]}
        >
          <Ionicons name="home-outline" size={28} color="#fff" />
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
        <Ionicons
          name="person-outline"
          size={26}
          color={isActive('Profil') ? '#6C63FF' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={logout}>
        <Ionicons name="log-out-outline" size={26} color="#fff" />
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
    justifyContent: 'space-evenly',
    alignItems: 'center',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 10,
  },
  homeButton: {
    backgroundColor: '#6C63FF',
    padding: 14,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  homeButtonActive: {
    backgroundColor: '#6C63FF',
  },
});

export default BottomNavBar;
