import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../contexts/authContext';
import { useEffect, useState } from 'react';
import { getUserMatchmakingSessions } from '../services/matchmakingService';
import { Matchmaking } from '../types/matchmakingTypes';

const ProfilScreen = () => {
  const [matchmakingHistory, setMatchmakingHistory] = useState<
    Matchmaking[] | null
  >(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatchmakingHistory = async () => {
      if (user?.id) {
        const match = await getUserMatchmakingSessions(user.id);

        setMatchmakingHistory(Array.isArray(match) ? match : null);
      }
    };
    fetchMatchmakingHistory();
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Profil de {user?.username}</Text>

        {matchmakingHistory === null && (
          <ActivityIndicator size="large" color="#6C63FF" />
        )}

        {matchmakingHistory && matchmakingHistory.length > 0 ? (
          <View>
            <Text style={styles.subtitle}>Historique des matchs :</Text>
            {matchmakingHistory.map((match) => (
              <View key={match.id} style={styles.matchItem}>
                <Text>🏆 Match ID: {match.id}</Text>
                <Text>👤 Joueur 1 : {match.playerOne?.username}</Text>
                <Text>⭐ Score: {match.playerOneScore}</Text>
                <Text>👤 Joueur 2 : {match.playerTwo?.username}</Text>
                <Text>⭐ Score: {match.playerTwoScore}</Text>
                <Text>
                  📅 Date: {new Date(match.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          matchmakingHistory !== null && <Text>Aucun match trouvé.</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff', padding: 20 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: '600', marginTop: 10 },
  matchItem: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    width: '100%',
  },
});
