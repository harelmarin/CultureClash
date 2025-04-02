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
      animationType="slide"
      transparent={true}
      visible={isOpen}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>🎉 Fin du match !</Text>
          <Text style={styles.message}>
            🏆 {winner ? `Le gagnant est ${winner}` : 'Match nul !'}
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    marginBottom: 10,
  },
  scores: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default GameOverModal;
