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
  const [eloUpdated, setEloUpdated] = useState(false);
  const [gameOverSent, setGameOverSent] = useState(false);

  useEffect(() => {
    const fetchPlayerNames = async () => {
      if (!matchmaking) return;
      try {
        const [playerOne, playerTwo] = await Promise.all([
          getUserById(matchmaking.playerOneId),
          getUserById(matchmaking.playerTwoId),
        ]);
        if (!playerOne || !playerTwo) return;
        if (user.id === playerOne.id) {
          setYourElo(playerOne.points);
          setOpponentElo(playerTwo.points);
          setYourName(playerOne.username);
          setOpponentName(playerTwo.username);
        } else {
          setYourElo(playerTwo.points);
          setOpponentElo(playerOne.points);
          setYourName(playerTwo.username);
          setOpponentName(playerOne.username);
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des noms:', err);
      }
    };
    fetchPlayerNames();
  }, [matchmaking, user.id]);

  useEffect(() => {
    if (timeLeft > 0) {
      if (!timerRef.current) {
        timerRef.current = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      }
    } else {
      handleTimeout();
    }

    return () => {
      clearTimeout(timerRef.current as NodeJS.Timeout);
      timerRef.current = null;
    };
  }, [timeLeft]);

  useEffect(() => {
    socket.emit('joinRoom', { roomId, playerId: user.id });
  }, [socket, roomId, user.id]);

  useEffect(() => {
    const onScore = (data: { userId: string; score: number }) => {
      if (data.userId === user.id) setPlayerScore(data.score);
      else setOpponentScore(data.score);
    };
    socket.on('scoreUpdated', onScore);
    return () => {
      socket.off('scoreUpdated', onScore);
    };
  }, [socket, user.id]);

  useEffect(() => {
    const onNext = (data: { questionIndex: number }) => {
      setCurrentQuestionIndex(data.questionIndex);
      setTimeLeft(10);
      setSelectedAnswer(null);
    };
    socket.on('updateQuestion', onNext);
    return () => {
      socket.off('updateQuestion', onNext);
    };
  }, [socket]);

  const handleTimeout = () => {
    if (isGameOver || gameOverSent) return;
    setGameOverSent(true);
    setIsGameOver(true);

    const playerOneId = matchmaking!.playerOneId;
    const playerTwoId = matchmaking!.playerTwoId;
    let p1 = null,
      p2 = null;

    if (playerOneId === user.id) {
      p1 = playerScore;
      p2 = opponentScore;
    } else {
      p1 = opponentScore;
      p2 = playerScore;
    }

    if (p1 == null || p2 == null) return;

    const winnerId =
      p1 === p2 ? 'égalité' : p1 > p2 ? playerOneId : playerTwoId;

    socket.off('quizFinished');
    socket.emit('quizFinished', {
      roomId,
      playerOneScore: p1,
      playerTwoScore: p2,
      winnerId,
    });
    socket.off('quizFinished');
  };

  useEffect(() => {
    const onGameOver = async (data: { winnerId: string | null }) => {
      const win = data.winnerId;
      if (!win || eloUpdated) return;

      try {
        await updatePoints(
          win,
          matchmaking!.playerOneId,
          matchmaking!.playerTwoId,
        );
      } catch (err) {
        console.error('Erreur updatePoints:', err);
      }

      setEloUpdated(true);

      if (win !== 'égalité') {
        const u = await getUserById(win);
        if (u) setWinner(u.username);
      } else {
        setWinner('égalité');
      }

      setGameOverSent(false);
    };

    socket.once('gameOver', onGameOver);
    return () => {
      socket.off('gameOver', onGameOver);
    };
  }, [socket, matchmaking]);

  const handleAnswer = (isCorrect: boolean) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(isCorrect);
    const newScore = playerScore + (isCorrect ? timeLeft : 0);
    setPlayerScore(newScore);
    socket.emit('updateScore', { roomId, userId: user.id, score: newScore });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ActivityIndicator style={{ flex: 1 }} size="large" color="#6C63FF" />
      </SafeAreaView>
    );
  }

  const current = questions[currentQuestionIndex];
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.headerWrapper}>
          <View style={styles.leftHeader}>
            <Text style={styles.headerTitle}>{yourname}</Text>
            <Text style={styles.eloText}>{`🌟 ${yourElo}`}</Text>
          </View>
          <View style={styles.rightHeader}>
            <Text style={styles.headerTitle}>{opponentname}</Text>
            <Text style={styles.eloText}>{`🌟 ${opponentElo}`}</Text>
          </View>
        </View>
      </View>

      <View style={styles.container2}>
        <View style={styles.timerRow}>
          <View style={styles.timerScore}>
            <Text style={styles.pointsText}>{playerScore}</Text>
          </View>
          <Timer duration={10} remaining={timeLeft} />
          <View style={styles.timerScore}>
            <Text style={styles.pointsText}>{opponentScore}</Text>
          </View>
        </View>
        <Text style={styles.progress}>
          Question {currentQuestionIndex + 1} / {questions.length}
        </Text>

        <View style={styles.questionContainer}>
          <Text style={styles.questionText}>{current.text}</Text>
        </View>
        {current.choices.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.choiceButton,
              selectedAnswer !== null && {
                backgroundColor: c.isCorrect ? 'green' : 'red',
              },
            ]}
            onPress={() => handleAnswer(c.isCorrect)}
            disabled={selectedAnswer !== null}
          >
            <Text style={styles.choiceText}>{c.text}</Text>
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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#00c999' },
  header: {
    padding: 20,
    backgroundColor: '#00c999',
    marginBottom: 20,
    elevation: 5,
  },
  headerWrapper: { flexDirection: 'row', justifyContent: 'space-between' },
  leftHeader: { alignItems: 'flex-start' },
  rightHeader: { alignItems: 'flex-end' },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Modak',
  },
  eloText: { fontSize: 18, fontWeight: 'bold', color: '#FFD700' },
  scoreText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  container2: { flex: 1, paddingHorizontal: 20 },
  progress: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginVertical: 10,
  },
  questionContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  questionText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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
      android: { elevation: 3 },
    }),
  },
  choiceText: { color: '#fff', fontSize: 16, textAlign: 'center' },
  timerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  timerScore: {
    alignItems: 'center',
  },
  nameText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  pointsText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginHorizontal: 50,
  },
});

export default QuizScreen;
