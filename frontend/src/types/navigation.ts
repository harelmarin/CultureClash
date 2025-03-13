import { NativeStackNavigationProp } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Home: undefined;
  Room: undefined;
  Quiz: { roomId: string };
  Result: undefined;
};

export type RoomScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Room">; 