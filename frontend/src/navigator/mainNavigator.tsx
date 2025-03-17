import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screen/HomeScreen';
import QuizScreen from '../screen/QuizScreen';
import ResultScreen from '../screen/ResultScreen';
import RoomScreen from '../screen/RoomScreen';
import FriendScreen from '../screen/FriendScreen';

const Stack = createNativeStackNavigator();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Quiz" component={QuizScreen} />
      <Stack.Screen name="Room" component={RoomScreen} />
      <Stack.Screen name="Friend" component={FriendScreen} />

      <Stack.Screen
        name="Result"
        component={ResultScreen as React.ComponentType<{}>}
        options={{
          headerShown: true,
        }}
      />
    </Stack.Navigator>
  );
};

export { MainNavigator };
