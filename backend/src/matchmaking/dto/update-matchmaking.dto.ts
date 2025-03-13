import { PartialType } from '@nestjs/swagger';
import { CreateMatchmakingDto } from './create-matchmaking.dto';

export class UpdateMatchmakingDto extends PartialType(CreateMatchmakingDto) {}
