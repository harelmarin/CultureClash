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
import { getUserById } from '../services/userService';

const ProfilScreen = () => {
  const [matchmakingHistory, setMatchmakingHistory] = useState<
    Matchmaking[] | null
  >(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMatchmakingHistory = async () => {
      if (!user?.id) return;

      const matches = await getUserMatchmakingSessions(user.id);

      if (Array.isArray(matches)) {
        const MatchWithUsername = await Promise.all(
          matches.map(async (match) => {
            let playerOneUsername = 'Inconnu';
            let playerTwoUsername = 'Inconnu';

            if (match.playerOneId) {
              const playerOne = await getUserById(match.playerOneId);
              if (playerOne?.username) {
                playerOneUsername = playerOne.username;
              } else {
                console.warn(`Joueur 1 non trouvé: ${match.playerOneId}`);
              }
            }

            if (match.playerTwoId) {
              const playerTwo = await getUserById(match.playerTwoId);
              if (playerTwo?.username) {
                playerTwoUsername = playerTwo.username;
              } else {
                console.warn(`Joueur 2 non trouvé: ${match.playerTwoId}`);
              }
            }

            const MatchWithUsername = {
              ...match,
              playerOneUsername,
              playerTwoUsername,
            };
            return MatchWithUsername;
          }),
        );

        console.log('Historique des matchs:', MatchWithUsername);
        setMatchmakingHistory(MatchWithUsername);
      } else {
        setMatchmakingHistory(null);
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
                <Text style={styles.playerText}>
                  👤 Joueur 1 : {match.playerOneUsername}
                </Text>
                <Text style={styles.scoreText}>
                  ⭐ Score: {match.playerOneScore}
                </Text>
                <Text style={styles.playerText}>
                  👤 Joueur 2 : {match.playerTwoUsername}
                </Text>
                <Text style={styles.scoreText}>
                  ⭐ Score: {match.playerTwoScore}
                </Text>
                <Text style={styles.dateText}>
                  📅 Date: {new Date(match.createdAt).toLocaleDateString()}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          matchmakingHistory !== null && (
            <Text style={styles.noMatchText}>Aucun match trouvé.</Text>
          )
        )}
      </View>
    </SafeAreaView>
  );
};

export default ProfilScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F3F4F6', padding: 20 },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 15,
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 10,
    color: '#4B5563',
  },
  matchItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    width: '100%',
    maxWidth: 350,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  playerText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '600',
  },
  scoreText: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 5,
  },
  noMatchText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
