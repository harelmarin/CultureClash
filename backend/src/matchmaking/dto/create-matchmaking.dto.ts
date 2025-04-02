import { IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMatchmakingDto {
  @ApiProperty({
    description: 'Id de la game webSocket',
    type: String,
    example: 'match-1743577182430',
  })
  @IsUUID()
  id: string;

  @ApiProperty({
    description: 'ID du joueur 1',
    type: String,
    example: '15688eb8-c43e-4f9b-92bf-0d4ae60232f5',
  })
  @IsUUID()
  playerOneId: string;

  @ApiProperty({
    description: 'ID du joueur 2',
    type: String,
    example: '4ff74b1e-8101-486d-853c-45d4db14a750',
  })
  @IsUUID()
  playerTwoId: string;
}
