import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { RoomScreenNavigationProp } from '../types/navigation';
import { useAuth } from '../contexts/authContext';
import { useSocket } from '../contexts/socketContext';
import BottomNavBar from '../components/NavBar';
import Toast from 'react-native-toast-message';

const HomeScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const { user } = useAuth();
  const socket = useSocket();

  const [roomId, setRoomId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState<boolean | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [isInQueue, setIsInQueue] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [matchStarted, setMatchStarted] = useState(false);
  const [queueTime, setQueueTime] = useState(0);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    console.log('✅ HomeScreen connecté au WebSocket :', socket.id);

    socket.on('matchFound', (data) => {
      console.log('🎮 Match trouvé !', data);
      setRoomId(data.roomId);
      setTimer(data.timeToAccept);
      setHasAccepted(false);
    });

    socket.on('gameStart', (data) => {
      setIsPlayer1(data.isPlayer1);
      setMatchStarted(true);
      setIsInQueue(false);
      setHasAccepted(false);

      if (data.roomId) {
        navigation.navigate('Quiz', {
          roomId: data.roomId,
          matchmaking: data.matchmaking,
        });
      }
    });

    socket.on('matchTimeout', () => {
      console.log('⏰ Le match a expiré');
      resetState();
    });

    socket.on('playerLeft', () => {
      console.log('👋 Un joueur a quitté le match');
      resetState();
    });

    socket.on('matchRefused', ({ roomId }) => {
      console.log('❌ L’autre joueur a refusé le match pour la room', roomId);
      resetState();
      Toast.show({
        type: 'error',
        text1: 'Match refusé',
        text2: 'L’autre joueur a annulé le match.',
      });
    });

    return () => {
      socket.off('matchFound');
      socket.off('gameStart');
      socket.off('matchTimeout');
      socket.off('playerLeft');
      socket.off('matchRefused');
    };
  }, [socket, navigation]);

  useEffect(() => {
    if (isInQueue && queueTime >= 0) {
      countdownRef.current = setInterval(() => {
        setQueueTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (!isInQueue && countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isInQueue]);

  const resetState = () => {
    setRoomId(null);
    setIsPlayer1(null);
    setTimer(null);
    setIsInQueue(false);
    setHasAccepted(false);
    setQueueTime(0);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
  };

  const joinQueue = () => {
    if (user && user.id && socket) {
      socket.emit('joinQueue', { userId: user.id });
      setIsInQueue(true);
      console.log(
        `📥 Demande d'entrée dans la file d'attente avec userId: ${user.id}`,
      );
    } else {
      Alert.alert(
        'Non connecté',
        'Vous devez être connecté pour rejoindre une partie',
        [{ text: 'OK' }],
      );
    }
  };

  const leaveQueue = () => {
    if (timer !== null && timer > 0) return;
    socket?.emit('leaveQueue');
    resetState();
    console.log("📤 Sortie de la file d'attente.");
  };

  const acceptMatch = () => {
    if (roomId && socket) {
      socket.emit('acceptMatch', { roomId });
      setHasAccepted(true);
      console.log('✅ Match accepté');
    }
  };

  const refuseMatch = () => {
    if (roomId && socket) {
      socket.emit('refuseMatch', { roomId });
      resetState();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.userProfileBox}>
        <Text style={styles.userName}>{user?.username ?? 'Invité'}</Text>
        <Text style={styles.userPoints}>🌟 {user?.points ?? 0} pts</Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.title}>CultureClash</Text>

        {isInQueue && !roomId && (
          <View style={styles.queueContainer}>
            <ActivityIndicator size="large" color="#3498db" />
            <Text style={styles.queueText}>
              Temps dans la file : {queueTime}s
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.playButton}
          onPress={isInQueue ? leaveQueue : joinQueue}
        >
          <Text style={styles.playButtonText}>
            {isInQueue ? 'Annuler' : '🎮 Jouer maintenant'}
          </Text>
        </TouchableOpacity>
      </View>
      <BottomNavBar />
      {roomId && timer !== null && !hasAccepted && (
        <Modal animationType="fade" transparent={true} visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>🎮 Match trouvé !</Text>
              <Text style={styles.modalSubtitle}>Acceptez-vous le match ?</Text>
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={acceptMatch}
                >
                  <Text style={styles.btnText}>✅ Accepter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.refuseBtn}
                  onPress={refuseMatch}
                >
                  <Text style={styles.btnText}>❌ Refuser</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00c999',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  queueContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  queueText: {
    fontSize: 20,
    color: '#3498db',
    fontWeight: 'bold',
    marginTop: 15,
  },
  matchContainer: {
    alignItems: 'center',
    backgroundColor: '#2ecc71',
    padding: 25,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
  },
  roomText: {
    fontSize: 26,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  roomIdText: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  timerContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    alignItems: 'center',
    width: '100%',
  },
  timerText: {
    fontSize: 24,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  acceptedText: {
    fontSize: 18,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  startContainer: {
    backgroundColor: '#3498db',
    padding: 20,
    borderRadius: 12,
    marginVertical: 15,
    width: '100%',
    alignItems: 'center',
  },
  startText: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
  userProfileBox: {
    position: 'absolute',
    top: 100,
    left: 50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  userPoints: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  playButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 22,
    paddingHorizontal: 50,
    borderRadius: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2ecc71',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#2ecc71',
    paddingVertical: 12,
    borderRadius: 10,
    marginRight: 10,
    alignItems: 'center',
  },
  refuseBtn: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 12,
    borderRadius: 10,
    marginLeft: 10,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default HomeScreen;
