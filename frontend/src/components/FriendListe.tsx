import { View, Text, StyleSheet } from "react-native";
import { useAuth } from "../contexts/authContext";
import { useFriendsList } from "../hooks/useFriends";

const FriendListe = () => {
  const { user } = useAuth();
  const { data: friendsList = [], isLoading, error } = useFriendsList(user?.id || '');

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Erreur lors du chargement des amis</Text>
      </View>
    );
  }

  const renderedList = friendsList.map((follow) => (
    <View key={follow.id} style={styles.friendCard}>
      <View style={styles.friendInfo}>
        <Text style={styles.username}>{follow.followedUser.username}</Text>
        <Text style={styles.points}>Points: {follow.followedUser.points || 0}</Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes amis ({friendsList.length})</Text>
      {friendsList.length === 0 ? (
        <Text style={styles.noFriends}>Aucun ami pour le moment</Text>
      ) : renderedList}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  error: {
    color: '#ef4444',
    textAlign: 'center',
    fontSize: 16,
  },
  noFriends: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 16,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  friendCard: {
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  friendInfo: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 4,
  },
  points: {
    fontSize: 14,
    color: '#64748b',
  },
});

export default FriendListe;