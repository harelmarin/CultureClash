import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useState } from 'react';
import { findFriendByUsername } from '../services/friendService';
import { User } from '../types/userTypes';
import { useAuth } from '../contexts/authContext';
import { FriendRequests } from '../components/FriendRequests';
import FriendListe from '../components/FriendListe';
import { useFonts } from 'expo-font';
import BottomNavBar from '../components/NavBar';
import { IP_PC } from '../../config';
import Toast from 'react-native-toast-message';

const FriendScreen = () => {
  const [username, setUsername] = useState('');
  const [foundUser, setFoundUser] = useState<User | null>(null);
  const { user } = useAuth();

  useFonts({
    Modak: require('../assets/font/Modak-Regular.ttf'),
  });

  const searchFriend = async () => {
    if (username.trim() !== '') {
      const result = await findFriendByUsername(username);
      if (result === false) {
        Toast.show({
          type: 'error',
          text1: 'Utilisateur non trouvé',
          text2: "Aucun utilisateur trouvé avec ce nom d'utilisateur.",
        });
        setFoundUser(null);
      } else {
        setFoundUser(result as User);
      }
    }
  };

  const sendFriendRequest = async () => {
    if (!foundUser || !user) return;

    if (foundUser.id === user.id) {
      Toast.show({
        type: 'error',
        text1: "Impossible d'ajouter ce joueur en ami",
        text2: "Vous ne pouvez pas envoyer une demande d'ami à vous-même.",
      });
      return;
    }
    try {
      const response = await fetch(`${IP_PC}/friend-request`, {
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
        Toast.show({
          type: 'success',
          text1: "Demande d'ami envoyée",
          text2: "Votre demande d'ami a été envoyée avec succès!",
        });
        setFoundUser(null);
      } else {
        Toast.show({
          type: 'error',
          text1: "Erreur lors de l'envoi",
          text2:
            "Une erreur s'est produite lors de l'envoi de la demande d'ami.",
        });
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Erreur de connexion',
        text2: 'Impossible de se connecter au serveur.',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1 }} // Assurer que le ScrollView prend toute la place
      >
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

        {foundUser && (
          <View style={styles.userCard}>
            <Text style={styles.username}>{foundUser.username}</Text>
            <Text style={styles.email}>{foundUser.email}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={sendFriendRequest}
            >
              <Text style={styles.addButtonText}>Ajouter en ami</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.sectionsContainer}>
          <FriendRequests />
          <FriendListe />
        </View>
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
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
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
    fontSize: 30,
    fontFamily: 'Modak',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  searchContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    borderRadius: 20,
    marginBottom: 20,
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
    marginBottom: 40,
  },
});

export default FriendScreen;
