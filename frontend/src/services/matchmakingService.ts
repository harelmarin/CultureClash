import { Matchmaking } from '../types/matchmakingTypes';

const BASE_URL = 'http://localhost:3000';

export const createMatchmaking = async (): Promise<Matchmaking | boolean> => {
  try {
    const matchmaking = await fetch(`${BASE_URL}/matchmaking`, {
      method: 'POST',
      credentials: 'include',
    });
    if (matchmaking.ok) {
      return (await matchmaking.json()) as Matchmaking;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la création du matchmaking:', error);
    return false;
  }
};
