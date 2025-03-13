import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionModule } from './question/question.module';
import { GatewayModule } from './gateway/gateway.module';
import { SeedModule } from '../prisma/seed/seed.module';
import { MatchmakingModule } from './matchmaking/matchmaking.module';
@Module({
  imports: [
    UserModule,
    PrismaModule,
    QuestionModule,
    GatewayModule,
    SeedModule,
    MatchmakingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
