import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMatchmakingDto } from './dto/create-matchmaking.dto';
import { UpdateMatchmakingDto } from './dto/update-matchmaking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Matchmaking } from './entities/matchmaking.entity';

@Injectable()
export class MatchmakingService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createMatchmakingDto: CreateMatchmakingDto) {
    try {
      const matchs = await this.prisma.matchmakingSession.create({
        data: {
          playerOneId: createMatchmakingDto.playerOneId,
          playerTwoId: createMatchmakingDto.playerTwoId,
        },
      });
      return matchs;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la création de la session de matchmaking: ${error.message}`,
      );
    }
  }

  async findAll(): Promise<Matchmaking[]> {
    try {
      const matchs = await this.prisma.matchmakingSession.findMany({
        include: {
          playerOne: true,
          playerTwo: true,
          questions: {
            include: {
              choices: true,
            },
          },
        },
      });
      return matchs.map((match) => ({
        ...match,
        questions: match.questions.map((question) => ({
          ...question,
          choices: question.choices || [],
        })),
      }));
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la récupération des sessions de matchmaking: ${error.message}`,
      );
    }
  }

  findOne(id: string) {
    
  }
}
