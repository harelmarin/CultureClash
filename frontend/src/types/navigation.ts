import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Room: undefined;
  Login: undefined;
  Register: undefined;
  Friend: undefined;
  Quiz: { roomId: string; matchmaking: any };
  Result: { score: number };
};

export type RoomScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Room'
>;
