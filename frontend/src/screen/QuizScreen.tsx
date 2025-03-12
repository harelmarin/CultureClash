import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'Quiz'>;

type Question = {
  id: string;
  text: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

export function QuizScreen({ navigation }: Props) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simuler le chargement des questions depuis l'API
    setTimeout(() => {
      setQuestions([
        {
          id: '1',
          text: 'Quelle est la capitale de la France ?',
          choices: [
            { id: '1', text: 'Paris', isCorrect: true },
            { id: '2', text: 'Londres', isCorrect: false },
            { id: '3', text: 'Berlin', isCorrect: false },
            { id: '4', text: 'Madrid', isCorrect: false },
          ],
        },
        // Ajoutez plus de questions ici
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      navigation.navigate('Result', { score });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <View style={styles.container}>
      <Text style={styles.progress}>
        Question {currentQuestionIndex + 1} / {questions.length}
      </Text>

      <View style={styles.questionContainer}>
        <Text style={styles.questionText}>{currentQuestion.text}</Text>
      </View>

      <View style={styles.choicesContainer}>
        {currentQuestion.choices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
            style={styles.choiceButton}
            onPress={() => handleAnswer(choice.isCorrect)}
          >
            <Text style={styles.choiceText}>{choice.text}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  progress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  questionContainer: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
  },
  choicesContainer: {
    gap: 10,
  },
  choiceButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
}); 