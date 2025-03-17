import { User } from '../types/userTypes';

const BASE_URL = 'http://localhost:3000';

export const findFriendByUsername = async (
  username: string,
): Promise<User | boolean> => {
  console.log("Recherche de l'ami:", username);
  try {
    const friends = await fetch(`${BASE_URL}/user/usernamev2/${username}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (friends.ok) {
      return (await friends.json()) as User;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    return false;
  }
};
