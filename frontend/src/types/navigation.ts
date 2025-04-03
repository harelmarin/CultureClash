import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Room: undefined;
  Login: undefined;
  Register: undefined;
  Friend: undefined;
  Profil: undefined;
  Quiz: { roomId: string; matchmaking: any };
  Result: {
    winnerId: number;
    playerOneScore: number;
    playerTwoScore: number;
    message: string;
  };
};

export type RoomScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Room'
>;
