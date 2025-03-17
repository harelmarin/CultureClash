import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/authContext';
import { getPendingRequests, getUserById } from '../services/friendService';
import { Request } from '../types/requestTypes';
import { User } from '../types/userTypes';
import { FriendRequestCard } from './FriendRequestCard';

interface RequestWithUser extends Request {
  sender?: User;
}

export const FriendRequests = () => {
  const [pendingRequests, setPendingRequests] = useState<RequestWithUser[]>([]);
  const { user } = useAuth();

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
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  noRequests: {
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
}); 