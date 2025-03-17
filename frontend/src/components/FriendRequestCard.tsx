import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Request } from '../types/requestTypes';
import { User } from '../types/userTypes';
import { acceptRequest, rejectRequest } from '../services/friendService';

interface FriendRequestCardProps {
  request: Request & { sender?: User };
  onRequestHandled: () => void;
}

export const FriendRequestCard = ({ request, onRequestHandled }: FriendRequestCardProps) => {
  const handleAccept = async () => {
    await acceptRequest(request.id);
    onRequestHandled();
  };

  const handleReject = async () => {
    await rejectRequest(request.id);
    onRequestHandled();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.username}>
        De: {request.sender?.username || 'Utilisateur inconnu'}
      </Text>
      <Text style={styles.email}>{request.sender?.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={handleAccept}
        >
          <Text style={styles.buttonText}>Accepter</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={handleReject}
        >
          <Text style={styles.buttonText}>Refuser</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 8,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  email: {
    color: '#666',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    flex: 0.48,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#f44336',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
}); 