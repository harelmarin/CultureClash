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
import Timer from '../components/Timer';

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
  const [showModal, setShowModal] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    console.log('✅ HomeScreen connecté au WebSocket :', socket.id);

    socket.on('matchFound', (data) => {
      console.log('🎮 Match trouvé !', data);
      if (!hasAccepted) {
        setRoomId(data.roomId);
        setTimer(data.timeToAccept);
        setHasAccepted(false);
        setShowModal(true);
      }
    });

    socket.on('gameStart', (data) => {
      setIsPlayer1(data.isPlayer1);
      setMatchStarted(true);
      setIsInQueue(false);
      setHasAccepted(false);
      setShowModal(false);
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
  }, [socket, navigation, hasAccepted]);
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
      setShowModal(false);
      console.log('✅ Match accepté');
    }
  };

  const refuseMatch = () => {
    if (roomId && socket) {
      socket.emit('refuseMatch', { roomId });
      resetState();
      setShowModal(false);
    }
  };

  useEffect(() => {
    if (timer === null || hasAccepted || !showModal) return;

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer !== null && prevTimer > 0) {
          return prevTimer - 1;
        } else {
          clearInterval(interval);
          return 0;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, hasAccepted, showModal]);

  useEffect(() => {
    if (timer === 0 && !hasAccepted && roomId && socket) {
      refuseMatch();
    }
  }, [timer]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <Text style={styles.userName}>{user?.username ?? 'Invité'}</Text>
          <Text style={styles.userPoints}>🌟 {user?.points ?? 0}</Text>
        </View>
        <Text style={styles.title}>CultureClash</Text>

        {isInQueue && !roomId && (
          <View style={styles.queueContainer}>
            <ActivityIndicator
              size="large"
              color="#6C63FF"
              style={styles.rouetimer}
            />
            <View style={styles.queueContainer}>
              <Text style={styles.queueText}>
                🔍 En attente d’un adversaire...
              </Text>
              <View>
                <Text style={styles.queueTimeText}>{queueTime}s</Text>
              </View>
            </View>
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
      {roomId && timer !== null && !hasAccepted && showModal && (
        <Modal animationType="fade" transparent={true} visible={true}>
          <View style={styles.modalOverlay}>
            <View style={styles.customModal}>
              <Text style={styles.modalTitle}>🎮 Match trouvé !</Text>
              <Text style={styles.modalSubtitle}>
                Prêt à affronter ton adversaire ?
              </Text>

              <View style={styles.modalTimerWrapper}>
                <Timer duration={15} remaining={timer ?? 0} />
              </View>

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.acceptBtn}
                  onPress={acceptMatch}
                >
                  <Text style={styles.btnText}>Accepter</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.refuseBtn}
                  onPress={refuseMatch}
                >
                  <Text style={styles.btnText}>Refuser</Text>
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
    marginBottom: 16,
  },
  queueText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
  },
  queueTimeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6C63FF',
    marginTop: 24,
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
  rouetimer: {
    marginBottom: 15,
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
  profileContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 100,
    alignItems: 'center',
    width: 160,
    height: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
    marginTop: -140,
    marginBottom: 40,
    display: 'flex',
    justifyContent: 'center',
  },

  userName: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: 'Modak',
  },

  userPoints: {
    color: '#6C63FF',
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  customModal: {
    width: '85%',
    backgroundColor: '#00c999',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    color: '#f9f9f9',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalTimerWrapper: {
    marginVertical: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  acceptBtn: {
    flex: 1,
    backgroundColor: '#6C63FF',
    paddingVertical: 14,
    borderRadius: 14,
    marginRight: 8,
    alignItems: 'center',
  },
  refuseBtn: {
    flex: 1,
    backgroundColor: '#e74c3c',
    paddingVertical: 14,
    borderRadius: 14,
    marginLeft: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },

  timerBox: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  timerNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6C63FF',
    letterSpacing: 1,
  },
});

export default HomeScreen;
