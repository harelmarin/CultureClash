import { User } from '../../user/entities/user.entity';
import { Question } from '../../question/entities/question.entity';
import { GameStatus } from '@prisma/client';

export class Matchmaking {
  id: string;
  playerOneId: string;
  playerOne: User;
  playerTwoId: string | null;
  playerTwo: User | null;
  winnerId: string | null;
  status: GameStatus;
  createdAt: Date;
  questions: Question[];

  playerOneScore?: number;
  playerTwoScore?: number;
}
