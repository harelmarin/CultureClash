import { Module } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { QuestionService } from '../../src/question/question.service';
import { SeedService } from './seed.service';

@Module({
  providers: [PrismaService, QuestionService, SeedService],
  exports: [SeedService],
})
export class SeedModule {}
