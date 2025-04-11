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
          size={isActive('Leaderboard') ? 30 : 26}
          color={isActive('Leaderboard') ? '#6C63FF' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Friend')}>
        <Ionicons
          name="people-outline"
          size={isActive('Friend') ? 30 : 26}
          color={isActive('Friend') ? '#6C63FF' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Home')}>
        <Ionicons
          name="home-outline"
          size={isActive('Home') ? 32 : 28}
          color={isActive('Home') ? '#6C63FF' : '#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Profil')}>
        <Ionicons
          name="person-outline"
          size={isActive('Profil') ? 30 : 26}
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
    backgroundColor: '#00a387',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
    elevation: 10,
    zIndex: 100,
  },
});

export default BottomNavBar;
