import { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView } from 'react-native';
import { getUserLeaderBoard } from '../services/userService';
import { UserLeaderboard } from '../types/userTypes';
import BottomNavBar from '../components/NavBar';
import { useFonts } from 'expo-font';

const Leaderboard = () => {
  const [classement, setClassement] = useState<UserLeaderboard[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const data = await getUserLeaderBoard();

      if (data) {
        setClassement(data);
      } else {
        setError('Erreur de récupération du classement');
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Classement</Text>
        {error && <Text style={styles.errorText}>{error}</Text>}

        <ScrollView style={styles.scrollContainer}>
          {classement === null ? (
            <Text style={styles.noDataText}>Aucun classement disponible</Text>
          ) : classement.length === 0 ? (
            <Text style={styles.noDataText}>Le classement est vide</Text>
          ) : (
            classement.map((user, index) => (
              <View
                key={user.id}
                style={[styles.userCard, index < 3 && styles.topThree]}
              >
                <Text style={styles.rank}>{index + 1}</Text>
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.points}>Points: {user.points}</Text>
              </View>
            ))
          )}
        </ScrollView>
      </View>
      <BottomNavBar />
    </SafeAreaView>
  );
};
export default Leaderboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00c999',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 48,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  noDataText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  scrollContainer: {
    marginBottom: 60,
  },
  userCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 18,
    marginBottom: 15,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  topThree: {
    backgroundColor: '#6C63FF',
  },
  rank: {
    fontSize: 22,
    color: '#fff',
    fontWeight: 'bold',
    marginRight: 20,
  },
  username: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    flex: 1,
  },
  points: {
    fontSize: 14,
    color: '#fff',
  },
});
