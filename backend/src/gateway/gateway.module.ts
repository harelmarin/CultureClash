import { Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { MatchmakingModule } from '../matchmaking/matchmaking.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [MatchmakingModule, UserModule],
  providers: [MyGateway],
  exports: [MyGateway],
})
export class GatewayModule {}
