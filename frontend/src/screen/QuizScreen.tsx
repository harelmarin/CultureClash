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
import { RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSocket } from '../contexts/socketContext';
import { useAuth } from '../contexts/authContext';
import GameOverModal from '../components/modals/GameOver';
import { getUserById } from '../services/userService';
import { updatePoints } from '../services/pointService';
import Timer from '../components/Timer';
import { RootStackParamList } from '../types/navigation';

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
  const [yourElo, setYourElo] = useState(0);
  const [opponentElo, setOpponentElo] = useState(0);

  useEffect(() => {
    const fetchPlayerNames = async () => {
      try {
        if (!matchmaking) return;
        const [playerOne, playerTwo] = await Promise.all([
          getUserById(matchmaking.playerOneId),
          getUserById(matchmaking.playerTwoId),
        ]);

        if (playerOne) setYourElo(playerOne.points);
        if (playerTwo) setOpponentElo(playerTwo.points);

        if (!playerOne || !playerTwo) return;

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
    setTimeout(() => {
      if (isGameOver) return;

      const playerOneId = matchmaking?.playerOneId;
      const playerTwoId = matchmaking?.playerTwoId;

      let playerOneScore = null;
      let playerTwoScore = null;

      if (playerOneId === user.id) {
        playerOneScore = playerScore;
        playerTwoScore = opponentScore;
      } else if (playerTwoId === user.id) {
        playerOneScore = opponentScore;
        playerTwoScore = playerScore;
      }

      if (playerOneScore === null || playerTwoScore === null) return;

      if (playerOneScore > playerTwoScore) {
        updatePoints(playerOneId, playerTwoId);
      } else if (playerTwoScore > playerOneScore) {
        updatePoints(playerTwoId, playerOneId);
      }

      socket.emit('quizFinished', {
        roomId,
        playerOneScore,
        playerTwoScore,
        winnerId:
          playerOneScore === playerTwoScore
            ? 'égalité'
            : playerOneScore > playerTwoScore
            ? playerOneId
            : playerTwoId,
      });
    }, 100);
  };

  useEffect(() => {
    const handleGameOver = (data: { winnerId: string | null }) => {
      const winnerId = data.winnerId;

      if (winnerId && winnerId !== 'égalité') {
        getUserById(winnerId).then((winnerUser) => {
          if (winnerUser) {
            setWinner(winnerUser.username);
          }
        });
      } else {
        setWinner('égalité');
      }

      setIsGameOver(true);
    };

    socket.off('gameOver', handleGameOver);
    socket.on('gameOver', handleGameOver);

    return () => {
      socket.off('gameOver', handleGameOver);
    };
  }, [socket]);

  useEffect(() => {
    if (!isGameOver) {
      setWinner(null);
    }
  }, [isGameOver]);

  const handleAnswer = (isCorrect: boolean) => {
    if (selectedAnswer !== null) return;

    setSelectedAnswer(isCorrect);
    let newScore = playerScore;

    if (isCorrect) {
      newScore += timeLeft;
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
      <View style={styles.header}>
        <View style={styles.headerWrapper}>
          <View style={styles.leftHeader}>
            <Text style={styles.headerTitle}>{yourname}</Text>
            <Text style={styles.scoreText}>{yourElo} ELO</Text>
            <Text style={styles.scoreText}>{playerScore} pts</Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.headerTitle}>{opponentname}</Text>
            <Text style={styles.scoreText}>{opponentElo} ELO</Text>
            <Text style={styles.scoreText}>{opponentScore} pts</Text>
          </View>
        </View>
      </View>

      <View style={styles.container2}>
        <View style={styles.modalTimerWrapper}>
          <Timer duration={15} remaining={timeLeft ?? 0} />
        </View>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#00c999' },
  container: { flex: 1, padding: 20 },
  header: {
    padding: 20,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    backgroundColor: ' #00c999',
    elevation: 5,
    marginBottom: 20,
  },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
  leftHeader: { alignItems: 'flex-start' },
  rightHeader: { alignItems: 'flex-end' },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#fefefe' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#fefefe' },
  progress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  container2: { paddingHorizontal: 20, flex: 1 },
  questionContainer: {
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    marginBottom: 20,
    elevation: 3,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 30,
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
  choiceText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  modalTimerWrapper: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default QuizScreen;
