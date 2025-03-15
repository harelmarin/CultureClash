import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import { useNavigation } from '@react-navigation/native';
import { RoomScreenNavigationProp } from '../types/navigation';

type Question = {
  id: string;
  text: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

const QuizScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const mockQuestions = [
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
        ];
        setQuestions(mockQuestions);
      } catch (error) {
        console.error('Error loading questions:', error);
      } finally {
        setLoading(false);
      }
    };

    loadQuestions();
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
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ActivityIndicator size="large" color="#6C63FF" />
        </View>
      </SafeAreaView>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={styles.safeArea}>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  questionText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
  },
  choicesContainer: {
    gap: 10,
  },
  choiceButton: {
    backgroundColor: '#6C63FF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
  },
});
export default QuizScreen;
