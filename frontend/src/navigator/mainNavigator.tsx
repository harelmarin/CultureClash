import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import QuizScreen from '../screen/QuizScreen';
import ResultScreen from '../screen/ResultScreen';
import FriendScreen from '../screen/FriendScreen';
import ProfilScreen from '../screen/ProfilScreen';
import Leaderboard from '../screen/LeaderBoard';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Quiz"
        component={QuizScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Friend"
        component={FriendScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profil"
        component={ProfilScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Result"
        component={ResultScreen as React.ComponentType<{}>}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Leaderboard"
        component={Leaderboard as React.ComponentType<{}>}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};

export { MainNavigator };
