import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateQuestionDto } from './dto/create-question.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Question } from './entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Question[]> {
    try {
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
      return questions;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la récupération des questions : ${error.message}`,
      );
    }
  }

  async findOne(id: string): Promise<Question> {
    try {
      const question = await this.prisma.question.findUnique({
        where: { id },
        include: {
          choices: {
            select: { id: true, text: true, isCorrect: true },
          },
        },
      });

      return question;
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la récupération de la question ${id} : ${error.message}`,
      );
    }
  }

  async create(createQuestionDto: CreateQuestionDto) {
    const createdQuestion = await this.prisma.question.create({
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
        choices: true,
      },
    });

    const correctChoice = createdQuestion.choices.find(
      (choice) => choice.isCorrect,
    );

    if (correctChoice) {
      await this.prisma.question.update({
        where: { id: createdQuestion.id },
        data: { correctAnswerId: correctChoice.id },
      });
    }

    return createdQuestion;
  }

  async remove(id: string) {
    try {
      await this.prisma.choice.deleteMany({
        where: { questionId: id },
      });
      await this.prisma.question.delete({
        where: { id },
      });
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la suppression de la question ${id} et de ses choix : ${error.message}`,
      );
    }
  }

  async findByText(text: string) {
    return this.prisma.question.findFirst({
      where: {
        text: text,
      },
    });
  }

  async removeAll() {
    try {
      await this.prisma.choice.deleteMany();
      await this.prisma.question.deleteMany();
    } catch (error) {
      throw new InternalServerErrorException(
        `Erreur lors de la suppression de toutes les questions : ${error.message}`,
      );
    }
  }
}
