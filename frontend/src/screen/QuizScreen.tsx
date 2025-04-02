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
import { useSocket } from '../contexts/socketContext';
import { useAuth } from '../contexts/authContext';
import GameOverModal from '../components/modals/GameOver';
import { getUserById } from '../services/userService';

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
  const { user } = useAuth();
  const socket = useSocket();
  const route = useRoute<QuizScreenRouteProp>();
  const { roomId, matchmaking } = route.params;
  const navigation = useNavigation<QuizScreenNavigationProp>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(
    matchmaking?.questions || [],
  );
  const [loading, setLoading] = useState(!matchmaking?.questions?.length);
  const [timeLeft, setTimeLeft] = useState(10);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<boolean | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [yourname, setYourName] = useState('Vous');
  const [opponentname, setOpponentName] = useState('Adversaire');

  useEffect(() => {
    const fetchPlayerNames = async () => {
      try {
        if (!matchmaking) return;

        const [playerOne, playerTwo] = await Promise.all([
          getUserById(matchmaking.playerOneId),
          getUserById(matchmaking.playerTwoId),
        ]);

        if (!playerOne || !playerTwo) {
          console.error('Failed to fetch player data');
          return;
        }

        setYourName(
          user.id === playerOne.id ? playerOne.username : playerTwo.username,
        );
        setOpponentName(
          user.id === playerOne.id ? playerTwo.username : playerOne.username,
        );
      } catch (error) {
        console.error('Erreur lors de la récupération des noms:', error);
      }
    };

    fetchPlayerNames();
  }, [matchmaking, user.id]);

  useEffect(() => {
    if (timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else {
      handleTimeout();
    }
    return () => clearTimeout(timerRef.current as NodeJS.Timeout);
  }, [timeLeft]);

  useEffect(() => {
    socket.emit('joinRoom', { roomId, playerId: user.id });
    return () => {
      socket.off('scoreUpdated');
    };
  }, [socket, roomId, user.id]);

  useEffect(() => {
    socket.on('scoreUpdated', (data) => {
      if (data.userId === user.id) {
        setPlayerScore(data.score);
      } else {
        setOpponentScore(data.score);
      }
    });

    return () => {
      socket.off('scoreUpdated');
    };
  }, [socket, user.id, matchmaking]);

  useEffect(() => {
    socket.on('updateQuestion', (data) => {
      setCurrentQuestionIndex(data.questionIndex);
      setTimeLeft(10);
      setSelectedAnswer(null);
    });
    return () => {
      socket.off('updateQuestion');
    };
  }, [socket]);

  const handleTimeout = () => {
    console.log('playerScore:', playerScore, 'opponentScore:', opponentScore);

    let winnerId: string | null = null;

    if (playerScore > opponentScore) {
      winnerId = user.id;
    } else if (opponentScore > playerScore) {
      winnerId =
        matchmaking?.playerTwoId === user.id
          ? matchmaking?.playerOneId
          : matchmaking?.playerTwoId;
    } else {
      winnerId = 'draw';
    }

    socket.emit('quizFinished', {
      roomId,
      playerOneScore: playerScore,
      playerTwoScore: opponentScore,
    });

    setWinner(winnerId);
  };

  useEffect(() => {
    socket.on('gameOver', (data) => {
      const winnerId = data.winnerId;

      if (winnerId && winnerId !== 'draw') {
        getUserById(winnerId).then((winnerUser) => {
          if (winnerUser) {
            setWinner(winnerUser.username);
          }
        });
      } else {
        setWinner('Draw');
      }

      setIsGameOver(true);
    });

    return () => {
      socket.off('gameOver');
    };
  }, [socket]);

  const handleAnswer = (isCorrect: boolean) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(isCorrect);

    let newScore = playerScore;
    if (isCorrect) {
      newScore = playerScore + timeLeft;
    }

    setPlayerScore(newScore);

    socket.emit('updateScore', {
      roomId,
      userId: user.id,
      score: newScore,
    });
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
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>
            {yourname} {playerScore}
          </Text>
          <Text style={styles.scoreText}>
            🆚 {opponentname}: {opponentScore}
          </Text>
        </View>
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
              style={[
                styles.choiceButton,
                selectedAnswer !== null && {
                  backgroundColor: choice.isCorrect ? 'green' : 'red',
                },
              ]}
              onPress={() => handleAnswer(choice.isCorrect)}
              disabled={selectedAnswer !== null}
            >
              <Text style={styles.choiceText}>{choice.text}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <GameOverModal
          isOpen={isGameOver}
          winner={winner}
          playerOneScore={playerScore}
          playerTwoScore={opponentScore}
          yourName={yourname}
          OpponentName={opponentname}
          onClose={() => setIsGameOver(false)}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 20 },
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
      android: { elevation: 5 },
    }),
  },
  questionText: {
    fontSize: 20,
    color: '#333',
    textAlign: 'center',
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
  },
  choicesContainer: { gap: 10 },
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
      android: { elevation: 3 },
    }),
  },
  choiceText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: Platform.select({ ios: '600', android: 'bold' }),
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
});

export default QuizScreen;
