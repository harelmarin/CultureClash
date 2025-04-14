import { IP_PC } from '../../config';

interface PlayerId {
  winnerId: string;
  loserId: string;
}

export const updatePoints = async (
  winnerId: PlayerId,
  loserId: PlayerId,
): Promise<void> => {
  try {
    const response = await fetch(`${IP_PC}/user/points`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winnerId,
        loserId,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour des points');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des points:', error);
  }
};
