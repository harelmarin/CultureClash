import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
  BadRequestException,
  Delete,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('question')
@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les questions' })
  @ApiResponse({ status: 200, description: 'Liste de toutes les questions' })
  @ApiResponse({ status: 404, description: 'Aucune question trouvée' })
  async findAll() {
    const questions = await this.questionService.findAll();
    if (questions.length === 0) {
      throw new NotFoundException('Aucune question trouvée');
    }
    return questions;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une question par ID' })
  @ApiResponse({ status: 200, description: 'Retourne une question spécifique' })
  @ApiResponse({ status: 404, description: 'Question non trouvée' })
  async findOne(@Param('id') id: string) {
    return this.questionService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle question' })
  @ApiResponse({ status: 201, description: 'Question créée avec succès' })
  @ApiResponse({
    status: 400,
    description: 'Mauvaise requête (données invalides)',
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  @ApiBody({ type: CreateQuestionDto })
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    try {
      const createdQuestion =
        await this.questionService.create(createQuestionDto);
      return {
        message: 'Question créée avec succès',
        data: createdQuestion,
      };
    } catch (error) {
      throw new BadRequestException(
        `Erreur lors de la création de la question: ${error.message}`,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer une question par ID' })
  @ApiResponse({ status: 200, description: 'Question supprimée avec succès' })
  @ApiResponse({ status: 404, description: 'Question non trouvée' })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async remove(@Param('id') id: string) {
    try {
      await this.questionService.remove(id);
      return { message: 'Question supprimée avec succès' };
    } catch (error) {
      throw new NotFoundException(
        `Erreur lors de la suppression de la question ${id}: ${error.message}`,
      );
    }
  }

  @Delete()
  @ApiOperation({ summary: 'Supprimer toutes les questions' })
  @ApiResponse({
    status: 200,
    description: 'Toutes les questions ont été supprimées',
  })
  @ApiResponse({ status: 500, description: 'Erreur interne du serveur' })
  async removeAll() {
    try {
      await this.questionService.removeAll();
      return { message: 'Toutes les questions ont été supprimées' };
    } catch (error) {
      throw new NotFoundException(
        `Erreur lors de la suppression de toutes les questions: ${error.message}`,
      );
    }
  }

  @Get('random/:limit')
  @ApiOperation({ summary: 'Récupérer une question par ID' })
  @ApiResponse({ status: 200, description: 'Retourne une question spécifique' })
  @ApiResponse({ status: 404, description: 'Question non trouvée' })
  async randomQuestion(@Param('limit') limit: number) {
    return this.questionService.getRandom(limit);
  }
}
