import { View, Text, StyleSheet, Platform } from 'react-native';
import { useAuth } from '../contexts/authContext';
import { useFriendsList } from '../hooks/useFriends';
import { useFonts } from 'expo-font';

const FriendListe = () => {
  const { user } = useAuth();
  const {
    data: friendsList = [],
    isLoading,
    error,
  } = useFriendsList(user?.id || '');

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

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
        <Text style={styles.points}>
          {follow.followedUser.points || 0} points
        </Text>
      </View>
    </View>
  ));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes amis ({friendsList.length})</Text>
      {friendsList.length === 0 ? (
        <Text style={styles.noFriends}>Aucun ami pour le moment</Text>
      ) : (
        renderedList
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
  error: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noFriends: {
    textAlign: 'center',
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  friendCard: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  friendInfo: {
    flex: 1,
  },
  username: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  points: {
    fontSize: 14,
    color: '#6C63FF',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default FriendListe;
