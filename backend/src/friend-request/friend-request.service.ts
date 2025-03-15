import { Injectable } from '@nestjs/common';
import { CreateFriendRequestDto } from './dto/create-friend-request.dto';
import { UpdateFriendRequestDto } from './dto/update-friend-request.dto';
import { FriendRequestEntity } from './entities/friend-request.entity';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FriendRequestService {

  constructor(private readonly prismaService: PrismaService) { }

  async sendFriendRequest(createFriendRequestDto: CreateFriendRequestDto) {  // Vérifier que les deux utilisateurs existent
    const sender = await this.prismaService.user.findUnique({
      where: { id: createFriendRequestDto.senderId }
    });
    const receiver = await this.prismaService.user.findUnique({
      where: { id: createFriendRequestDto.receiverId }
    });

    if (!sender) {
      throw new Error('L\'expéditeur n\'existe pas');
    }

    if (!receiver) {
      throw new Error('Le destinataire n\'existe pas');
    }

    const existingFriendRequest = await this.prismaService.friendRequest.findFirst({
      where: {
        senderId: createFriendRequestDto.senderId,
        receiverId: createFriendRequestDto.receiverId
      }
    });

    if (existingFriendRequest) {
      throw new Error('Friend request already exists');
    }

    return this.prismaService.friendRequest.create({
      data: createFriendRequestDto
    });
  }

  async acceptFriendRequest(id: string) {
    const friendRequest = await this.prismaService.friendRequest.findUnique({
      where: { id }
    });

    if (!friendRequest) {
      throw new Error('Friend request not found');
    }

    await this.prismaService.friendRequest.update({
      where: { id },
      data: { status: 'ACCEPTED' },
      include: { sender: true, receiver: true }
    });


    await this.prismaService.follows.createMany({
      data: [
        {
          followingUserId: friendRequest.senderId,
          followedUserId: friendRequest.receiverId,
          status: 'ACCEPTED'
        },
        {
          followingUserId: friendRequest.receiverId,
          followedUserId: friendRequest.senderId,
          status: 'ACCEPTED'
        }
      ],
      skipDuplicates: true
    });

    return { message: 'Friend request accepted and follow relationship created' };
  }


  rejectFriendRequest(id: string) {
    return this.prismaService.friendRequest.update({
      where: { id },
      data: { status: 'REJECTED' }
    });
  }

  getPendingFriendRequests(receiverId: string): Promise<FriendRequestEntity[]> {
    return this.prismaService.friendRequest.findMany({
      where: {
        receiverId,
        status: 'PENDING'
      }
    });
  }

}
