import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingController } from './matchmaking.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { QuestionService } from 'src/question/question.service';

@Module({
  controllers: [MatchmakingController],
  providers: [MatchmakingService, PrismaService, QuestionService],
  exports: [MatchmakingService],
})
export class MatchmakingModule {}
