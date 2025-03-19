import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FriendService } from '../services/friendService';

export const useFriendsList = (userId: string) => {
  return useQuery({
    queryKey: ['friendsList', userId],
    queryFn: () => FriendService.getFriendsList(userId),
    staleTime: 1000 * 60 * 5
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FriendService.acceptRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsList'] });
    }
  });
};

export const useRejectFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: FriendService.rejectRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendsList'] });
    }
  });
}; 