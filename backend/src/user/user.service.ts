import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserWithoutPassword } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { register } from 'node:module';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findbyUsername(name: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: name,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findbyUsernameWithoutPassword(
    name: string,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: name,
        },
        select: {
          id: true,
          email: true,
          username: true,
          profilePic: true,
          createdAt: true,
          points: true,
          victories: true,
          defeats: true,
        },
      });

      if (!user) {
        throw new NotFoundException(`Utilisateur ${name} non trouvé`);
      }

      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(error);
    }
  }

  async findbyEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(name: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          username: name,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(@Body() registerDto: RegisterDto): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: registerDto.username,
          email: registerDto.email,
          password: registerDto.password,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updatePoint(
    winner: string,
    loser: string
  ): Promise<{ winner: User; loser: User }> {
    try {
      const checkScoreLoser = await this.prisma.user.findUnique({
        where: { id: loser },
        select: { points: true },
      });

      if (!checkScoreLoser) {
        throw new NotFoundException(`User ${loser} not found`);
      }

      const newLoserPoints = checkScoreLoser.points < 8 ? 0 : checkScoreLoser.points - 8;

      const [winnerUser, loserUser] = await this.prisma.$transaction([
        this.prisma.user.update({
          where: { id: winner },
          data: {
            points: { increment: 8 },
            victories: { increment: 1 }
          },
        }),
        this.prisma.user.update({
          where: { id: loser },
          data: {
            points: newLoserPoints,
            defeats: { increment: 1 }
          }
        }),

      ]);

      return { winner: winnerUser, loser: loserUser };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

}
