import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Home: undefined;
  Room: undefined;
  Quiz: { roomId: string };
  Result: { score: number };
};

export type RoomScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Room'
>;
