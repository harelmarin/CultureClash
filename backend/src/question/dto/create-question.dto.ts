import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsNotEmpty, ArrayMinSize } from 'class-validator';

export class CreateChoiceDto {
  @ApiProperty({
    description: 'Le texte du choix',
    example: 'Choix A',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'Indique si ce choix est correct',
    example: true,
  })
  @IsNotEmpty()
  isCorrect: boolean;
}

export class CreateQuestionDto {
  @ApiProperty({
    description: 'Le texte de la question',
    example: 'Quelle est la capitale de la France ?',
  })
  @IsString()
  @IsNotEmpty()
  text: string;

  @ApiProperty({
    description: 'La bonne réponse à la question',
    example: 'Paris',
  })
  @IsString()
  @IsNotEmpty()
  correctAnswer: string;

  @ApiProperty({
    description: 'Liste des choix associés à la question',
    type: [CreateChoiceDto],
    example: [
      { text: 'Paris', isCorrect: true },
      { text: 'Lyon', isCorrect: false },
      { text: 'Marseille', isCorrect: false },
      { text: 'Toulouse', isCorrect: false },
    ],
  })
  @IsArray()
  @ArrayMinSize(2)
  choices: CreateChoiceDto[];
}
