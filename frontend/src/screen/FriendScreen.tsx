import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { useState } from 'react';
import { findFriendByUsername } from '../services/friendService';
import { User } from '../types/userTypes';
import { useAuth } from '../contexts/authContext';

const FriendScreen = () => {
  const [username, setUsername] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const searchFriend = async () => {
    if (username.trim() !== '') {
      const result = await findFriendByUsername(username);
      if (result === false) {
        setError('Utilisateur non trouvé');
        setFoundUser(null);
      } else {
        setFoundUser(result as User);
        setError(null);
      }
    }
  };

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
    <View style={styles.container}>
      <Text style={styles.title}>Rechercher un ami</Text>
      <TextInput
        placeholder="Entrez un nom d'utilisateur"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        onSubmitEditing={searchFriend}
      />
      <Button title="Rechercher" onPress={searchFriend} />

      {error && <Text style={styles.error}>{error}</Text>}

      {foundUser && (
        <View style={styles.userCard}>
          <Text style={styles.username}>{foundUser.username}</Text>
          <Text style={styles.email}>{foundUser.email}</Text>

          <Button
            title="Ajouter en ami"
            onPress={sendFriendRequest}
            color="#4CAF50"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginBottom: 10,
  },
  userCard: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  email: {
    color: '#666',
    marginBottom: 10,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
});

export default FriendScreen;
