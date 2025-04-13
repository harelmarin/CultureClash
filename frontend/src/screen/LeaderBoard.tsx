import { useState, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { getUserLeaderBoard } from '../services/userService';
import { useFriendsList } from '../hooks/useFriends';
import { UserLeaderboard } from '../types/userTypes';
import BottomNavBar from '../components/NavBar';
import { useFonts } from 'expo-font';
import { FriendService } from '../services/friendService';
import { useAuth } from '../contexts/authContext';

const Leaderboard = () => {
  const [classementGlobal, setClassementGlobal] = useState<
    UserLeaderboard[] | null
  >(null);
  const [classementAmis, setClassementAmis] = useState<
    UserLeaderboard[] | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'global' | 'amis'>('global');

  const { user } = useAuth();

  useEffect(() => {
    const fetchClassementGlobal = async () => {
      try {
        const globalData = await getUserLeaderBoard();
        if (globalData) {
          setClassementGlobal(globalData);
        } else {
          setError('Erreur lors du chargement du classement global.');
        }
      } catch (err) {
        setError('Erreur lors du chargement du classement global.');
      }
    };

    fetchClassementGlobal();
  }, []);

  const fetchClassementAmis = async () => {
    try {
      const friendsRaw = await FriendService.getFriendsList(user.id);

      if (!friendsRaw) {
        setError('Erreur lors du chargement du classement des amis.');
        return;
      }

      const transformedFriends: UserLeaderboard[] = friendsRaw.map(
        (friend) => ({
          id: friend.followedUser.id,
          username: friend.followedUser.username,
          points: friend.followedUser.points,
        }),
      );

      transformedFriends.push({
        id: user.id,
        username: user.username,
        points: user.points,
      });

      const sorted = transformedFriends.sort((a, b) => b.points - a.points);

      setClassementAmis(sorted);
    } catch (err) {
      setError('Erreur lors du chargement du classement des amis.');
    }
  };

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  const { data: friendsData } = useFriendsList(user.id);

  useEffect(() => {
    if (friendsData && user) {
      const transformedFriends: UserLeaderboard[] = friendsData.map(
        (friend) => ({
          id: friend.followedUser.id,
          username: friend.followedUser.username,
          points: friend.followedUser.points,
        }),
      );

      transformedFriends.push({
        id: user.id,
        username: user.username,
        points: user.points,
      });

      const sorted = transformedFriends.sort((a, b) => b.points - a.points);

      setClassementAmis(sorted);
    }
  }, [friendsData, user]);

  const renderClassement = (data: UserLeaderboard[] | null) => {
    if (data === null) {
      return <Text style={styles.noDataText}>Chargement...</Text>;
    }

    if (data.length === 0) {
      return <Text style={styles.noDataText}>Aucun résultat</Text>;
    }

    return data.map((user, index) => (
      <View
        key={user.id}
        style={[styles.userCard, index < 3 && styles.topThree]}
      >
        <Text style={styles.rank}>{index + 1}</Text>
        <Text style={styles.username}>{user.username}</Text>
        <Text style={styles.points}>Points: {user.points}</Text>
      </View>
    ));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Classement</Text>

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'global' && styles.activeTab]}
            onPress={() => setActiveTab('global')}
          >
            <Text style={styles.tabText}>🌍 Global</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === 'amis' && styles.activeTab]}
            onPress={() => {
              setActiveTab('amis');
              fetchClassementAmis();
            }}
          >
            <Text style={styles.tabText}>👥 Amis</Text>
          </TouchableOpacity>
        </View>

        {error && <Text style={styles.errorText}>{error}</Text>}

        <ScrollView style={styles.scrollContainer}>
          {activeTab === 'global'
            ? renderClassement(classementGlobal)
            : renderClassement(classementAmis)}
        </ScrollView>
      </ScrollView>
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
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 10,
  },
  tab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#6C63FF',
  },
  tabText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
