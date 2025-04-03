import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateMatchmakingDto } from './dto/create-matchmaking.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Matchmaking } from './entities/matchmaking.entity';
import { EndGameDto } from './dto/end-game.dto';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class MatchmakingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionService: QuestionService,
  ) {}

  async create(createMatchmakingDto: CreateMatchmakingDto) {
    const questions = await this.questionService.getRandom(1);

    try {
      const matchs = await this.prisma.matchmakingSession.create({
        data: {
          id: createMatchmakingDto.id,
          playerOneId: createMatchmakingDto.playerOneId,
          playerTwoId: createMatchmakingDto.playerTwoId,
          questions: {
            connect: questions.map((question) => ({ id: question.id })),
          },
        },
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

  async endgame(endgameDto: EndGameDto): Promise<Matchmaking> {
    try {
      const updatedMatch = await this.prisma.matchmakingSession.update({
        where: {
          id: endgameDto.id,
        },
        data: {
          playerOneScore: endgameDto.playerOneScore,
          playerTwoScore: endgameDto.playerTwoScore,
          winnerId: endgameDto.winnerId,
          status: 'FINISHED',
        },
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

      return {
        ...updatedMatch,
        questions: updatedMatch.questions.map((question) => ({
          ...question,
          choices: question.choices || [],
        })),
      };
    } catch (error) {
      throw new Error(
        'Erreur lors de la mise à jour de la session de matchmaking',
      );
    }
  }

  getUserMatchmakingSessions = async (userId: string) => {
    const userWithMatchmakingSessions = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sessionsAsPlayerOne: true,
        sessionsAsPlayerTwo: true,
      },
    });

    if (!userWithMatchmakingSessions) {
      throw new Error('Utilisateur non trouvé');
    }
    return [
      ...userWithMatchmakingSessions.sessionsAsPlayerOne,
      ...userWithMatchmakingSessions.sessionsAsPlayerTwo,
    ];
  };
}
