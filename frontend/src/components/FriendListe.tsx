import { View, Text, StyleSheet } from "react-native";
import { getFriendsList } from "../services/friendService";
import { useEffect, useMemo, useCallback } from "react";
import { useAuth } from "../contexts/authContext";
import { User } from "../types/userTypes";
import { useState } from "react";

const FriendListe = () => {
  const [friendsList, setFriendsList] = useState<User[]>([]);
  const { user } = useAuth();

  const fetchFriendsList = useCallback(async () => {
    if (!user) return;

    try {
      console.log("Fetching friends for user:", user.id);
      const friends = await getFriendsList(user.id);
      console.log("Friends list:", friends);
      // Filtrer les amis undefined ou null
      const validFriends = friends.filter(friend => friend && friend.username);
      console.log("Valid friends:", validFriends);
      setFriendsList(validFriends);
    } catch (error) {
      console.error("Erreur lors de la récupération des amis:", error);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchFriendsList();
  }, [fetchFriendsList]);

  const renderedList = useMemo(() => (
    friendsList.map((friend) => {
      if (!friend || !friend.username) {
        console.log("Friend invalide:", friend);
        return null;
      }
      return (
        <View key={friend.id} style={styles.friendCard}>
          <View style={styles.friendInfo}>
            <Text style={styles.username}>{friend.username}</Text>
            <Text style={styles.points}>Points: {friend.points || 0}</Text>
          </View>
        </View>
      );
    }).filter(Boolean)
  ), [friendsList]);

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