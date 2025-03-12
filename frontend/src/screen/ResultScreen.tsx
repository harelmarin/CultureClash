import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

export function ResultScreen({ navigation, route }: Props) {
  const { score } = route.params;

  return (
    <View style={styles.container}>

      <Text style={styles.scoreText}>Score</Text>
      <Text style={styles.score}>{score}</Text>

      <Text style={styles.message}>
        {score > 7 ? 'Excellent !' : score > 4 ? 'Bien joué !' : 'Continuez à vous entraîner !'}
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Retour à l'accueil</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  trophy: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  scoreText: {
    fontSize: 24,
    color: '#666',
    marginBottom: 10,
  },
  score: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginBottom: 20,
  },
  message: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#6C63FF',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 