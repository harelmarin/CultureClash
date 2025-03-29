import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RoomScreenNavigationProp } from '../types/navigation';
import { useAuth } from '../contexts/authContext';
import { useSocket } from '../contexts/socketContext';

const RoomScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const { user } = useAuth();
  const socket = useSocket();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState<boolean | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [matchStarted, setMatchStarted] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!socket) return;

    console.log('✅ RoomScreen connecté au WebSocket :', socket.id);

    socket.on('matchFound', (data) => {
      console.log('🎮 Match trouvé !', data);
      setRoomId(data.roomId);
      setTimer(data.timeToAccept);
      setHasAccepted(false);
    });

    socket.on('gameStart', (data) => {
      console.log('🚀 La partie commence !', data);
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

    return () => {
      socket.off('matchFound');
      socket.off('gameStart');
      socket.off('matchTimeout');
      socket.off('playerLeft');
    };
  }, [socket, navigation]);

  const resetState = () => {
    setRoomId(null);
    setIsPlayer1(null);
    setTimer(null);
    setMatchStarted(false);
    setIsInQueue(false);
    setHasAccepted(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Matchmaking</Text>

      {isInQueue && !roomId && (
        <View style={styles.queueContainer}>
          <ActivityIndicator size="large" color="#3498db" />
          <Text style={styles.queueText}>Recherche d'un adversaire...</Text>
          <Text style={styles.queueSubText}>Veuillez patienter</Text>
        </View>
      )}

      {roomId ? (
        <View style={styles.matchContainer}>
          <Text style={styles.roomText}>🎮 Match trouvé !</Text>
          <Text style={styles.roomIdText}>Room ID: {roomId}</Text>
          {timer !== null && timer > 0 ? (
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>⏳ Accepter dans {timer}s...</Text>
              {!hasAccepted && (
                <Button
                  title="Accepter le match"
                  onPress={acceptMatch}
                  color="#2ecc71"
                />
              )}
              {hasAccepted && (
                <Text style={styles.acceptedText}>✅ Match accepté</Text>
              )}
            </View>
          ) : (
            matchStarted && (
              <View style={styles.startContainer}>
                <Text style={styles.startText}>🚀 La partie commence !</Text>
              </View>
            )
          )}
        </View>
      ) : (
        !isInQueue && (
          <Text style={styles.waitingText}>
            Cliquez sur "Rejoindre la file" pour commencer
          </Text>
        )
      )}

      <View style={styles.buttonContainer}>
        <Button
          title="Rejoindre la file"
          onPress={joinQueue}
          disabled={roomId !== null || isInQueue}
          color="#3498db"
        />
        <Button
          title="Quitter la file"
          onPress={leaveQueue}
          color="red"
          disabled={timer !== null && timer > 0}
        />
      </View>
    </View>
  );
};

export default RoomScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2c3e50',
  },
  queueContainer: { alignItems: 'center', marginBottom: 30 },
  queueText: {
    fontSize: 20,
    color: '#3498db',
    fontWeight: 'bold',
    marginTop: 15,
  },
  queueSubText: { fontSize: 16, color: '#7f8c8d', marginTop: 5 },
  matchContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    elevation: 5,
    marginBottom: 20,
  },
  roomText: {
    fontSize: 24,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomIdText: { fontSize: 16, color: '#7f8c8d', marginBottom: 15 },
  timerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  timerText: {
    fontSize: 24,
    color: '#e74c3c',
    fontWeight: 'bold',
    marginBottom: 15,
  },
  acceptedText: { fontSize: 18, color: '#2ecc71', fontWeight: 'bold' },
  startContainer: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  startText: { fontSize: 24, color: '#3498db', fontWeight: 'bold' },
  buttonContainer: { width: '100%', marginTop: 20, gap: 10 },
  waitingText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 20,
  },
});
