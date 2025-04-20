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
  const [profilEgalite, setProfilEgalite] = useState<number>(0);

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  useFocusEffect(
    React.useCallback(() => {
      const fetchData = async () => {
        if (!user?.id) return;

        const matches = await getUserMatchmakingSessions(user.id);

        if (Array.isArray(matches)) {
          let victoireCount = 0;
          let defaiteCount = 0;
          let egaliteCount = 0;

          const MatchWithUsername = await Promise.all(
            matches.map(async (match) => {
              let playerOneUsername = 'Inconnu';
              let playerTwoUsername = 'Inconnu';

              if (match.playerOneId) {
                const playerOne = await getUserById(match.playerOneId);
                if (playerOne?.username) playerOneUsername = playerOne.username;
              }

              if (match.playerTwoId) {
                const playerTwo = await getUserById(match.playerTwoId);
                if (playerTwo?.username) playerTwoUsername = playerTwo.username;
              }

              if (
                match.playerOneId === user.id ||
                match.playerTwoId === user.id
              ) {
                if (match.playerOneScore === match.playerTwoScore) {
                  egaliteCount++;
                } else if (match.winnerId === user.id) {
                  victoireCount++;
                } else {
                  defaiteCount++;
                }
              }

              return {
                ...match,
                playerOneUsername,
                playerTwoUsername,
              };
            }),
          );

          setProfilVictoire(victoireCount);
          setProfilDefaite(defaiteCount);
          setProfilEgalite(egaliteCount);
          setMatchmakingHistory(MatchWithUsername);
        } else {
          setMatchmakingHistory(null);
        }

        const profileUser = await getUserById(user.id);
        if (profileUser) {
          setProfilPoint(profileUser.points);
        }
      };

      fetchData();
    }, [user?.id]),
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.title}>Profil de {user?.username}</Text>
        </View>

        <View>
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Victoires</Text>
              <Text style={styles.statValue}>{profilVictoire}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Défaites</Text>
              <Text style={styles.statValue}>{profilDefaite}</Text>
            </View>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Égalités</Text>
              <Text style={styles.statValue}>{profilEgalite}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>🌟{profilPoint}</Text>
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
            {matchmakingHistory.map((match) => {
              let backgroundColor = 'rgba(255, 255, 255, 0.1)';
              let resultLabel = '';

              if (match.playerOneScore === match.playerTwoScore) {
                backgroundColor = 'rgba(176, 190, 197, 0.2)';
                resultLabel = 'Égalité';
              } else if (match.winnerId === user.id) {
                backgroundColor = '#6C63FF';
                resultLabel = 'Victoire';
              } else {
                backgroundColor = '#F44336';
                resultLabel = 'Défaite';
              }

              return (
                <View key={match.id}>
                  <View style={[styles.matchItem, { backgroundColor }]}>
                    <View style={styles.matchHeader}>
                      <Text style={styles.matchDate}>
                        {new Date(match.createdAt).toLocaleDateString()}
                      </Text>
                      <View style={styles.matchResult}>
                        <Text style={[styles.resultText]}>{resultLabel}</Text>
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
                </View>
              );
            })}
          </>
        ) : (
          matchmakingHistory !== null && (
            <View style={styles.noMatchContainer}>
              <Ionicons name="sad-outline" size={48} color="#fff" />
              <Text style={styles.noMatchText}>Aucun match trouvé</Text>
            </View>
          )
        )}
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
    paddingBottom: 80,
  },
  header: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 25,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 34,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 130,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  statLabel: {
    color: '#6C63FF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  separator: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginVertical: 20,
  },
  subtitle: {
    fontSize: 28,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  matchItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 18,
    borderRadius: 12,
    marginBottom: 15,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  matchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  matchDate: {
    color: '#fff',
    fontSize: 14,
  },
  matchResult: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  resultText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  playersContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  playerContainer: {
    alignItems: 'center',
    width: '45%',
  },
  playerName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  playerScore: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  vsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  vsText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  noMatchContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  noMatchText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginTop: 10,
  },
});

export default ProfilScreen;
