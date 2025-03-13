import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EndGameDto {
  @ApiProperty({
    description: 'Score du joueur 1',
    type: Number,
  })
  @IsNumber()
  playerOneScore: number;

  @ApiProperty({
    description: 'Score du joueur 2',
    type: Number,
  })
  @IsNumber()
  playerTwoScore: number;
}
