import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { RootStackParamList } from '../../types/navigation';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

interface GameOverModalProps {
  isOpen: boolean;
  winner: string | null;
  playerOneScore: number;
  playerTwoScore: number;
  yourName: string;
  OpponentName: string;
  onClose: () => void;
}

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Quiz'>;

const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  winner,
  playerOneScore,
  playerTwoScore,
  yourName,
  OpponentName,
  onClose,
}) => {
  if (!isOpen) return null;

  const navigation = useNavigation<NavigationProp>();

  const handleCloseAndNavigate = () => {
    onClose();
    navigation.navigate('Home');
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🎉 Fin du match !</Text>
          <Text style={styles.message}>
            🏆 {winner ? `${winner}` : 'Match nul !'}
          </Text>
          <Text style={styles.scores}>
            {yourName} : {playerOneScore} pts
          </Text>
          <Text style={styles.scores}>
            {OpponentName} : {playerTwoScore} pts
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={handleCloseAndNavigate}
          >
            <Text style={styles.buttonText}>🏠 Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#00c999',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 24,
    color: '#f9f9f9',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  scores: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 40,
    backgroundColor: '#6C63FF',
    borderRadius: 14,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default GameOverModal;
