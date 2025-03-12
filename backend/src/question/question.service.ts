import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    const questions = this.prisma.question.findMany();

    if (!questions) {
      throw new UnauthorizedException('No questions found');
    }

    return questions;
  }

  findOne(id: string) {
    const question = this.prisma.question.findUnique({
      where: {
        id: id,
      },
    });
    if (!question) {
      throw new UnauthorizedException(`Question ${id} not found`);
    }
  }

  create(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        text: createQuestionDto.text,
        choices: {
          create: createQuestionDto.choices.map((choice) => ({
            text: choice.text,
            isCorrect: choice.isCorrect,
          })),
        },
      },
      include: {
        choices: true,
      },
    });
  }
}
