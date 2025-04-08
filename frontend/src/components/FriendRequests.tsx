import { View, Text, StyleSheet, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { getPendingRequests, getUserById } from '../services/friendService';
import { Request } from '../types/requestTypes';
import { User } from '../types/userTypes';
import { FriendRequestCard } from './FriendRequestCard';
import { useFonts } from 'expo-font';

interface RequestWithUser extends Request {
  sender?: User;
}

export const FriendRequests = () => {
  const [pendingRequests, setPendingRequests] = useState<RequestWithUser[]>([]);
  const { user } = useAuth();

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  useEffect(() => {
    loadPendingRequests();
  }, []);

  const loadPendingRequests = async () => {
    if (user) {
      const requests = await getPendingRequests(user.id);
      const requestsWithUser = await Promise.all(
        requests.map(async (request) => {
          const sender = await getUserById(request.senderId);
          return { ...request, sender: sender || undefined };
        })
      );
      setPendingRequests(requestsWithUser as RequestWithUser[]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Demandes d'amis en attente</Text>
      {pendingRequests.length === 0 ? (
        <Text style={styles.noRequests}>Aucune demande en attente</Text>
      ) : (
        pendingRequests.map((request) => (
          <FriendRequestCard
            key={request.id}
            request={request}
            onRequestHandled={loadPendingRequests}
          />
        ))
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Modak',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  noRequests: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
}); 