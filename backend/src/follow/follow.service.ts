import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { UpdateFollowDto } from './dto/update-follow.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class FollowService {
  constructor(private readonly prismaService: PrismaService) { }

  async getFollows(id: string) {
    return this.prismaService.follows.findMany({
      where: {
        followedUserId: id
      }
    });
  }

  async getFollowers(id: string) {
    return this.prismaService.follows.findMany({
      where: {
        followingUserId: id,
        status: 'ACCEPTED'
      },
      include: {
        followedUser: {
          select: {
            id: true,
            email: true,
            username: true,
            profilePic: true,
            createdAt: true,
            points: true,
          }
        }
      }
    });
  }
}
