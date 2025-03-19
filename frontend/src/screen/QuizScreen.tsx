import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Question = {
  id: string;
  text: string;
  choices: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

type QuizScreenRouteProp = RouteProp<RootStackParamList, 'Quiz'>;
type QuizScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Quiz'
>;

const QuizScreen = () => {
  const route = useRoute<QuizScreenRouteProp>();
  const { roomId, matchmaking } = route.params;
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(
    matchmaking?.questions || [],
  );
  const [loading, setLoading] = useState(!matchmaking?.questions?.length);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    console.log('❓ Questions :', questions);
  }, [matchmaking]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      handleTimeout();
    }

    return () =>
      clearTimeout(timerRef.current as unknown as number | undefined);
  }, [timeLeft]);

  const handleAnswer = async (isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + timeLeft);
    }

    nextQuestion();
  };

  const handleTimeout = () => {
    nextQuestion();
  };

  const nextQuestion = () => {
    clearTimeout(timerRef.current as NodeJS.Timeout | undefined);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(10);
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
        <Text style={styles.timer}>⏳ Temps restant: {timeLeft}s</Text>
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
  timer: {
    fontSize: 18,
    color: '#ff5555',
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
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
