import { View, Text, TextInput, TouchableOpacity, StyleSheet, Platform, SafeAreaView } from 'react-native';
import { useState } from 'react';
import { findFriendByUsername } from '../services/friendService';
import { User } from '../types/userTypes';
import { useAuth } from '../contexts/authContext';
import { FriendRequests } from '../components/FriendRequests';
import FriendListe from '../components/FriendListe';
import { useFonts } from 'expo-font';

const FriendScreen = () => {
  const [username, setUsername] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  const searchFriend = async () => {
    if (username.trim() !== '') {
      const result = await findFriendByUsername(username);
      if (result === false) {
        setError('Utilisateur non trouvé');
        setFoundUser(null);
        console.log("Utilisateur non trouvé");
      } else {
        setFoundUser(result as User);
        setError(null);
      }
    }
  };

  if (foundUser?.id === user?.id) {
    return (
      <View>
        <Text>Impossible d'ajouter ce joueur en ami</Text>
      </View>
    );
  }

  const sendFriendRequest = async () => {
    if (!foundUser || !user) return;

    try {
      const response = await fetch('http://localhost:3000/friend-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          senderId: user.id,
          receiverId: foundUser.id,
        }),
      });

      if (response.ok) {
        setError("Demande d'ami envoyée avec succès!");
        setFoundUser(null);
      } else {
        setError("Erreur lors de l'envoi de la demande d'ami");
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Rechercher un joueur</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Entrez un nom d'utilisateur"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
            value={username}
            onChangeText={setUsername}
            style={styles.input}
            onSubmitEditing={searchFriend}
          />
          <TouchableOpacity style={styles.searchButton} onPress={searchFriend}>
            <Text style={styles.searchButtonText}>Rechercher</Text>
          </TouchableOpacity>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {foundUser && (
          <View style={styles.userCard}>
            <Text style={styles.username}>{foundUser.username}</Text>
            <Text style={styles.email}>{foundUser.email}</Text>
            <TouchableOpacity style={styles.addButton} onPress={sendFriendRequest}>
              <Text style={styles.addButtonText}>Ajouter en ami</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionsContainer}>
          <FriendRequests />
          <FriendListe />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#00c999',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: 15,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginBottom: 15,
    color: '#fff',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    padding: 15,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.2)',
  },
  errorText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  userCard: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  username: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  email: {
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 15,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#6C63FF',
    paddingVertical: 12,
    borderRadius: 15,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionsContainer: {
    flex: 1,
  },
});

export default FriendScreen;
