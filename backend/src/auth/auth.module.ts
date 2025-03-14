import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { SessionModule } from './session/session.module';

@Module({
  imports: [PassportModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    PrismaService,
    UserService,
    LocalStrategy,
    LocalAuthGuard,
    SessionModule,
  ],
})
export class AuthModule {}
