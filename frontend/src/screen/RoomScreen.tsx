import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { io } from 'socket.io-client';
import { useNavigation } from '@react-navigation/native';
import { RoomScreenNavigationProp } from '../types/navigation';

const socket = io('http://localhost:3000', {
  transports: ['websocket', 'polling'],
});

const RoomScreen = () => {
  const navigation = useNavigation<RoomScreenNavigationProp>();
  const [roomId, setRoomId] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState<boolean | null>(null);
  const [timer, setTimer] = useState<number | null>(null);
  const [matchStarted, setMatchStarted] = useState(false);
  const [isInQueue, setIsInQueue] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timer !== null && timer > 0) {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      countdownRef.current = setInterval(() => {
        setTimer((prev) => {
          if (prev !== null && prev > 1) {
            return prev - 1;
          } else {
            if (countdownRef.current) {
              clearInterval(countdownRef.current);
            }
            return 0;
          }
        });
      }, 1000);
    }

    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [timer]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connecté au WebSocket :', socket.id);
    });

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

      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }

      if (data.roomId) {
        navigation.navigate('Quiz', { roomId: data.roomId });
      }
    });

    socket.on('matchTimeout', (data) => {
      console.log('⏰ Le match a expiré');
      setRoomId(null);
      setTimer(null);
      setHasAccepted(false);
      setIsInQueue(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    });

    socket.on('playerLeft', (data) => {
      console.log('👋 Un joueur a quitté le match');
      setRoomId(null);
      setTimer(null);
      setHasAccepted(false);
      setIsInQueue(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    });

    return () => {
      socket.off('matchFound');
      socket.off('gameStart');
      socket.off('matchTimeout');
      socket.off('playerLeft');
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [navigation]);

  const joinQueue = () => {
    socket.emit('joinQueue');
    setIsInQueue(true);
    console.log("📥 Demande d'entrée dans la file d'attente...");
  };

  const leaveQueue = () => {
    if (timer !== null && timer > 0) return;
    socket.emit('leaveQueue');
    setRoomId(null);
    setIsPlayer1(null);
    setTimer(null);
    setMatchStarted(false);
    setIsInQueue(false);
    setHasAccepted(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }
    console.log("📤 Sortie de la file d'attente.");
  };

  const acceptMatch = () => {
    if (roomId) {
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

      {isPlayer1 !== null && (
        <View style={styles.playerContainer}>
          <Text style={styles.playerText}>
            {isPlayer1
              ? '🔵 Vous êtes le joueur 1'
              : '🔴 Vous êtes le joueur 2'}
          </Text>
        </View>
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
  queueSubText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 5,
  },
  matchContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  roomText: {
    fontSize: 24,
    color: '#2ecc71',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomIdText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 15,
  },
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
  acceptedText: {
    fontSize: 18,
    color: '#2ecc71',
    fontWeight: 'bold',
  },
  startContainer: {
    backgroundColor: '#e8f4f8',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  startText: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
  },
  waitingText: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  playerContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
  },
  playerText: {
    fontSize: 18,
    color: '#2c3e50',
    fontWeight: 'bold',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
    gap: 10,
  },
});
