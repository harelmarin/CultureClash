import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { User, UserWithoutPassword } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
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
    winnerId: string,
    playerOneId: string,
    playerTwoId: string,
  ): Promise<{ winner: User; loser: User }> {
    try {
      let winner: string;
      let loser: string;

      if (winnerId === playerOneId) {
        winner = playerOneId;
        loser = playerTwoId;
      } else if (winnerId === playerTwoId) {
        winner = playerTwoId;
        loser = playerOneId;
      } else {
        throw new NotFoundException('ID du gagnant invalide');
      }

      const winnerUser = await this.prisma.user.findUnique({
        where: { id: winner },
        select: { id: true, points: true },
      });

      const loserUser = await this.prisma.user.findUnique({
        where: { id: loser },
        select: { id: true, points: true },
      });

      if (!winnerUser || !loserUser) {
        throw new NotFoundException(
          "Un ou les deux utilisateurs n'ont pas été trouvés",
        );
      }

      const K = 4;

      const expectedWinner =
        1 / (1 + Math.pow(10, (loserUser.points - winnerUser.points) / 400));
      const expectedLoser =
        1 / (1 + Math.pow(10, (winnerUser.points - loserUser.points) / 400));

      const newWinnerPoints = winnerUser.points + K * (1 - expectedWinner);
      const newLoserPoints = loserUser.points + K * (0 - expectedLoser);

      const winnerIncrement = Math.round(newWinnerPoints - winnerUser.points);
      const rawLoserIncrement = Math.round(newLoserPoints - loserUser.points);
      const loserIncrement = Math.max(rawLoserIncrement, -loserUser.points);

      const updatedWinner = await this.prisma.user.update({
        where: { id: winner },
        data: {
          points: { increment: winnerIncrement },
          victories: { increment: 1 },
        },
      });

      const updatedLoser = await this.prisma.user.update({
        where: { id: loser },
        data: {
          points: { increment: loserIncrement },
          defeats: { increment: 1 },
        },
      });

      return {
        winner: updatedWinner,
        loser: updatedLoser,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }


  async getUserByPoint() {
    try {
      const users = await this.prisma.user.findMany({
        orderBy: {
          points: 'desc',
        },
        select: {
          id: true,
          username: true,
          points: true,
        },
      });
      return users;
    } catch (error) {
      console.log('Erreur back de récupération des users par point');
    }
  }
}
