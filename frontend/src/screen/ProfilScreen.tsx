import React, { useEffect, useState } from 'react';
import {
  View,
  SafeAreaView,
  StyleSheet,
  Text,
  ActivityIndicator,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../contexts/authContext';
import { getUserMatchmakingSessions } from '../services/matchmakingService';
import { Matchmaking } from '../types/matchmakingTypes';
import { getUserById } from '../services/userService';
import { useFonts } from 'expo-font';
import BottomNavBar from '../components/NavBar';
import { useFocusEffect } from '@react-navigation/native';

const ProfilScreen = () => {
  const [matchmakingHistory, setMatchmakingHistory] = useState<
    Matchmaking[] | null
  >(null);
  const { user } = useAuth();
  const [profilPoint, setProfilPoint] = useState<number>(0);
  const [profilVictoire, setProfilVictoire] = useState<number>(0);
  const [profilDefaite, setProfilDefaite] = useState<number>(0);

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });
  useFocusEffect(
    React.useCallback(() => {
      const getInfo = async () => {
        if (!user?.id) return;

        const profileUser = await getUserById(user.id);
        if (profileUser) {
          setProfilPoint(profileUser.points);
          setProfilVictoire(profileUser.victories);
          setProfilDefaite(profileUser.losses || 0);
        }
      };
      getInfo();

      const fetchMatchmakingHistory = async () => {
        if (!user?.id) return;

        const matches = await getUserMatchmakingSessions(user.id);

        if (Array.isArray(matches)) {
          let victoireCount = 0;
          let defaiteCount = 0;

          const MatchWithUsername = await Promise.all(
            matches.map(async (match) => {
              let playerOneUsername = 'Inconnu';
              let playerTwoUsername = 'Inconnu';

              if (match.playerOneId) {
                const playerOne = await getUserById(match.playerOneId);
                if (playerOne?.username) {
                  playerOneUsername = playerOne.username;
                }
              }

              if (match.playerTwoId) {
                const playerTwo = await getUserById(match.playerTwoId);
                if (playerTwo?.username) {
                  playerTwoUsername = playerTwo.username;
                }
              }

              if (match.winnerId === user.id) {
                victoireCount += 1;
              } else if (
                match.playerOneId === user.id ||
                match.playerTwoId === user.id
              ) {
                defaiteCount += 1;
              }

              return {
                ...match,
                playerOneUsername,
                playerTwoUsername,
              };
            }),
          );

          setProfilVictoire((prev) => prev + victoireCount);
          setProfilDefaite((prev) => prev + defaiteCount);

          setMatchmakingHistory(MatchWithUsername);
        } else {
          setMatchmakingHistory(null);
        }
      };

      fetchMatchmakingHistory();
    }, [user?.id]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View>
          <View style={styles.header}>
            <Text style={styles.title}>Profil de {user?.username}</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statText}>Victoires: {profilVictoire}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statText}>Défaites: {profilDefaite}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statText}>🌟{profilPoint}</Text>
              </View>
            </View>
          </View>

          {matchmakingHistory === null && (
            <ActivityIndicator size="large" color="#fff" />
          )}

          <View style={styles.separator} />

          {matchmakingHistory && matchmakingHistory.length > 0 ? (
            <>
              <Text style={styles.subtitle}>Historique des matchs</Text>
              {matchmakingHistory.map((match) => (
                <View key={match.id} style={styles.matchItem}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchDate}>
                      {new Date(match.createdAt).toLocaleDateString()}
                    </Text>
                    <View style={styles.matchResult}>
                      <Text style={styles.resultText}>
                        {match.winnerId === user.id
                          ? 'Victoire'
                          : match.playerOneScore === match.playerTwoScore
                          ? 'Égalité'
                          : 'Défaite'}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.playersContainer}>
                    <View style={styles.playerContainer}>
                      <Text style={styles.playerName}>
                        {match.playerOneUsername}
                      </Text>
                      <Text style={styles.playerScore}>
                        {match.playerOneScore} pts
                      </Text>
                    </View>
                    <View style={styles.vsContainer}>
                      <Text style={styles.vsText}>VS</Text>
                    </View>
                    <View style={styles.playerContainer}>
                      <Text style={styles.playerName}>
                        {match.playerTwoUsername}
                      </Text>
                      <Text style={styles.playerScore}>
                        {match.playerTwoScore} pts
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </>
          ) : (
            matchmakingHistory !== null && (
              <View style={styles.noMatchContainer}>
                <Ionicons name="sad-outline" size={48} color="#fff" />
                <Text style={styles.noMatchText}>Aucun match trouvé</Text>
              </View>
            )
          )}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
      <BottomNavBar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00c999',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  header: {
    padding: 25,
    borderRadius: 25,
    marginBottom: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  title: {
    fontSize: 32,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  statText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 30,
    fontFamily: 'Modak',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  matchItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 15,
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
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  matchDate: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  matchResult: {
    backgroundColor: 'rgba(108, 99, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(108, 99, 255, 0.3)',
  },
  resultText: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: '600',
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerContainer: {
    flex: 1,
    alignItems: 'center',
  },
  playerName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  playerScore: {
    color: '#6C63FF',
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  vsContainer: {
    paddingHorizontal: 15,
  },
  vsText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  noMatchContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noMatchText: {
    color: '#fff',
    fontSize: 20,
    marginTop: 15,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginVertical: 20,
  },
});

export default ProfilScreen;
