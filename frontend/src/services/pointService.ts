import { IP_PC } from '../../config';

let updateInProgress = false;

export const updatePoints = async (
  winnerId: string,
  playerOneId: string,
  playerTwoId: string,
): Promise<void> => {
  if (updateInProgress) {
    return;
  }

  updateInProgress = true;

  try {
    const response = await fetch(`${IP_PC}/user/points`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        winnerId,
        playerOneId,
        playerTwoId,
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour des points');
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour des points:', error);
  } finally {
    updateInProgress = false;
  }
};
