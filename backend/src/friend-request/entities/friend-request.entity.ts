import { FriendRequest, RequestStatus } from '@prisma/client';

export class FriendRequestEntity implements FriendRequest {
  id: string;
  senderId: string;
  receiverId: string;
  status: RequestStatus;
  createdAt: Date;
}
