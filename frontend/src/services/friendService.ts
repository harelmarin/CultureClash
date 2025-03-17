import { User } from '../types/userTypes';
import { Request } from '../types/requestTypes';

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

export const getPendingRequests = async (userId: string): Promise<Request[]> => {
  try {
    const response = await fetch(`${BASE_URL}/friend-request/${userId}/pending`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.map((request: any) => ({
        id: request.id,
        senderId: request.senderId,
        receiverId: request.receiverId,
        status: request.status
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des demandes d\'ami:', error);
    return [];
  }
}

export const acceptRequest = async (requestId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/friend-request/${requestId}/accept`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur lors de l'acceptation de la demande:", error);
    return false;
  }
};

export const rejectRequest = async (requestId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}/friend-request/${requestId}/reject`, {
      method: 'PATCH',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.ok;
  } catch (error) {
    console.error("Erreur lors du rejet de la demande:", error);
    return false;
  }
};

export const sendFriendRequest = async (senderId: string, receiverId: string): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3000/friend-request', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        senderId,
        receiverId,
      }),
    });

    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de l'envoi de la demande d'ami");
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    return null;
  }
};

export const getFriendsList = async (userId: string): Promise<User[]> => {
  try {
    const response = await fetch(`${BASE_URL}/user/${userId}/friends`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return await response.json();
    }
    return [];
  } catch (error) {
    console.error('Erreur lors de la récupération de la liste d\'amis:', error);
    return [];
  }
};