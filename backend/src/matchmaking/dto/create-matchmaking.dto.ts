import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchmakingDto {
  @ApiProperty({
    description: 'ID du joueur 1',
    type: String,
  })
  @IsString()
  playerOneId: string;

  @ApiProperty({
    description: 'ID du joueur 2',
    type: String,
  })
  @IsString()
  playerTwoId: string;
}
