import { User } from './userTypes';
import { Question } from './questionTypes';
import { types } from '@babel/core';

export enum GameStatus {
  PENDING = 'PENDING',
  FINISHED = 'FINISHED',
}

export type Matchmaking = {
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
  playerOneUsername?: string;
  playerTwoUsername?: string;
};
