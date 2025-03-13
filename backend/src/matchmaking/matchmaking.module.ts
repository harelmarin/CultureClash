import { Module } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { MatchmakingController } from './matchmaking.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [MatchmakingController],
  providers: [MatchmakingService, PrismaService],
})
export class MatchmakingModule {}
