import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EndGameDto {
  @ApiProperty({
    description: 'ID de la game webSocket',
    type: String,
    example: 'match-1743577182430',
  })
  @IsString()
  id: string;
  @ApiProperty({
    description: 'Score du joueur 1',
    type: Number,
    example: 30,
  })
  @IsNumber()
  playerOneScore: number;

  @ApiProperty({
    description: 'Score du joueur 2',
    type: Number,
    example: 70,
  })
  @IsNumber()
  playerTwoScore: number;

  @ApiProperty({
    description: 'ID du joueur gagnant',
    type: String,
    example: '4ff74b1e-8101-486d-853c-45d4db14a750',
  })
  @IsString()
  winnerId: string;
}
