import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { useFonts } from 'expo-font';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';

export function SplashScreen() {
  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.navigate('Login');
    }, 3500);

    return () => clearTimeout(timer);
  });

  return (
    <View style={styles.container}>
      <LottieView
        source={require('../assets/animation/brain.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.appName}>CultureClash</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00c999',
  },
  appName: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#FFF',
    fontFamily: 'Modak',
  },
  animation: {
    width: 300,
    height: 300,
  },
});
export default SplashScreen;
