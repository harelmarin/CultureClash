import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { QuestionModule } from './question/question.module';
import { GatewayModule } from './gateway/gateway.module';
@Module({
  imports: [UserModule, PrismaModule, QuestionModule, GatewayModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

