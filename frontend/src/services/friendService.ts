import { User } from '../types/userTypes';
import { Request } from '../types/requestTypes';
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import { apiClient } from './apiclient';
import { get } from 'http';
import { IP_PC } from '../../config';

export interface Follow {
  id: string;
  followingUserId: string;
  followedUserId: string;
  status: string;
  createdAt: string;
  followedUser: User;
}

export const findFriendByUsername = async (
  username: string,
): Promise<User | boolean> => {
  console.log("Recherche de l'ami:", username);
  try {
    const friends = await fetch(`${IP_PC}/user/usernamev2/${username}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('Statut de la réponse:', friends.status);
    if (friends.ok) {
      const userData = await friends.json();
      console.log('Utilisateur trouvé:', userData);
      return userData as User;
    } else {
      console.log('Utilisateur non trouvé, statut:', friends.status);
      return false;
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des amis:', error);
    return false;
  }
};

export const getPendingRequests = async (
  userId: string,
): Promise<Request[]> => {
  try {
    const response = await fetch(`${IP_PC}/friend-request/${userId}/pending`, {
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
        status: request.status,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Erreur lors de la récupération des demandes d'ami:", error);
    return [];
  }
};

export const sendFriendRequest = async (
  senderId: string,
  receiverId: string,
): Promise<boolean> => {
  try {
    const response = await fetch(`${IP_PC}/friend-request`, {
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
      throw new Error(
        errorData.message || "Erreur lors de l'envoi de la demande d'ami",
      );
    }
  } catch (error) {
    console.error("Erreur lors de l'envoi de la demande:", error);
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const response = await fetch(`${IP_PC}/user/${userId}`, {
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
    console.error("Erreur lors de la récupération de l'utilisateur:", error);
    return null;
  }
};

export const FriendFetchService = {
  acceptRequest: async (requestId: string) => {
    return apiClient<{ message: string }>(
      '/friend-request/' + requestId + '/accept',
    );
  },

  rejectRequest: async (requestId: string) => {
    return apiClient<{ message: string }>(
      '/friend-request/' + requestId + '/reject',
    );
  },

  getFriendsList: async (userId: string) => {
    return apiClient<Follow[]>('/follow/' + userId + '/followers');
  },
};

export const FriendService = {
  getFriendsList: async (userId: string): Promise<Follow[]> => {
    try {
      const response = await fetch(`${IP_PC}/follow/${userId}/followers`, {
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
      console.error(
        `Erreur lors de la récupération de la liste d'amis: ${userId}`,
        error,
      );
      return [];
    }
  },

  acceptRequest: async (requestId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${IP_PC}/friend-request/${requestId}/accept`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.ok;
    } catch (error) {
      console.error("Erreur lors de l'acceptation de la demande:", error);
      return false;
    }
  },

  rejectRequest: async (requestId: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `${IP_PC}/friend-request/${requestId}/reject`,
        {
          method: 'PATCH',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      return response.ok;
    } catch (error) {
      console.error('Erreur lors du rejet de la demande:', error);
      return false;
    }
  },
};
