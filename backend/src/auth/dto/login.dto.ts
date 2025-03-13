import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Usernma',
    example: 'Marin',
  })
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: "Le mot de passe de l'utilisateur",
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}
