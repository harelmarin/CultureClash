import { Matchmaking } from '../types/matchmakingTypes';
import { IP_PC } from '../../config';

export const createMatchmaking = async (): Promise<Matchmaking | boolean> => {
  try {
    const matchmaking = await fetch(`${IP_PC}/matchmaking`, {
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

export const endMatchmaking = async (): Promise<Matchmaking | boolean> => {
  try {
    const matchmaking = await fetch(`${IP_PC}/matchmaking)`, {
      method: 'PATCH',
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

export const getUserMatchmakingSessions = async (
  id: string,
): Promise<Matchmaking | boolean> => {
  try {
    const matchmaking = await fetch(`${IP_PC}/matchmaking/user/${id}`, {
      method: 'GET',
      credentials: 'include',
    });
    if (matchmaking.ok) {
      return (await matchmaking.json()) as Matchmaking;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des matchmakings', error);
    return false;
  }
};
