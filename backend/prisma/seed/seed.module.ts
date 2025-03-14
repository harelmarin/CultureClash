import { Module } from '@nestjs/common';
import { PrismaService } from '../../src/prisma/prisma.service';
import { QuestionService } from '../../src/question/question.service';
import { SeedService } from './seed.service';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [
    PrismaService,
    QuestionService,
    SeedService,
    AuthService,
    UserService,
  ],
  exports: [SeedService],
})
export class SeedModule {}
