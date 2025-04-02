import { UserName } from '../types/userTypes';

const BASE_URL = 'http://localhost:3000';

export const getUserById = async (id: string): Promise<UserName | null> => {
  try {
    const response = await fetch(`${BASE_URL}/user/${id}`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      console.error(`Erreur récupération du joueur avec id : ${id}`);
      return null;
    }

    return (await response.json()) as UserName;
  } catch (error) {
    console.error(
      `Erreur lors de la récupération du joueur avec id : ${id}`,
      error,
    );
    return null;
  }
};
