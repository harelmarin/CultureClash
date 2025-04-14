import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Request } from '../types/requestTypes';
import { User } from '../types/userTypes';
import {
  useAcceptFriendRequest,
  useRejectFriendRequest,
} from '../hooks/useFriends';

interface FriendRequestCardProps {
  request: Request & { sender?: User };
  onRequestHandled: () => void;
}

export const FriendRequestCard = ({
  request,
  onRequestHandled,
}: FriendRequestCardProps) => {
  const acceptMutation = useAcceptFriendRequest();
  const rejectMutation = useRejectFriendRequest();

  const handleAccept = async () => {
    await acceptMutation.mutateAsync(request.id);
    onRequestHandled();
  };

  const handleReject = async () => {
    await rejectMutation.mutateAsync(request.id);
    onRequestHandled();
  };

  return (
    <View style={styles.card}>
      <Text style={styles.username}>
        {request.sender?.username || 'Utilisateur inconnu'}
      </Text>
      <Text style={styles.email}>{request.sender?.email}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.acceptButton]}
          onPress={handleAccept}
          disabled={acceptMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {acceptMutation.isPending ? 'En cours...' : 'Accepter'}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.rejectButton]}
          onPress={handleReject}
          disabled={rejectMutation.isPending}
        >
          <Text style={styles.buttonText}>
            {rejectMutation.isPending ? 'En cours...' : 'Refuser'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  username: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  email: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    flex: 0.48,
  },
  acceptButton: {
    backgroundColor: 'rgba(108, 255, 181, 0.9)',
    borderColor: '#00c999',
    borderWidth: 1,
  },
  rejectButton: {
    backgroundColor: 'rgba(255, 99, 132, 0.9)',
    borderColor: '#ff4e6a',
    borderWidth: 1,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
    fontSize: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
});
