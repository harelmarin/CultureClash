import {
  IsString,
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    description: "L'email de l'utilisateur",
    type: String,
    example: 'user@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: "Le nom d'utilisateur",
    type: String,
    example: 'Marin',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: 'Le mot de passe',
    type: String,
    example: 'password',
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
