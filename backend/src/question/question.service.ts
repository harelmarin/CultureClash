import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Question[]> {
    const questions = await this.prisma.question.findMany({
      include: {
        choices: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    });

    if (!questions) {
      throw new UnauthorizedException('No questions found');
    }

    return questions;
  }

  async findOne(id: string): Promise<Question> {
    const question = this.prisma.question.findUnique({
      where: {
        id: id,
      },
      include: {
        choices: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    });

    if (!question) {
      throw new UnauthorizedException(`Question ${id} not found`);
    }

    return question;
  }

  async create(createQuestionDto: CreateQuestionDto) {
    return this.prisma.question.create({
      data: {
        text: createQuestionDto.text,
        choices: {
          createMany: {
            data: createQuestionDto.choices.map((choice) => ({
              text: choice.text,
              isCorrect: choice.isCorrect,
            })),
          },
        },
      },
      include: {
        choices: {
          select: {
            id: true,
            text: true,
            isCorrect: true,
          },
        },
      },
    });
  }
}
