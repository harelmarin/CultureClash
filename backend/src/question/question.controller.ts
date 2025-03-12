import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  NotFoundException,
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
  findAll() {
    return this.questionService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une question par ID' })
  @ApiResponse({ status: 200, description: 'Retourne une question spécifique' })
  @ApiResponse({ status: 404, description: 'Question non trouvée' })
  async findOne(@Param('id') id: string) {
    const question = await this.questionService.findOne(id);

    if (!question) {
      throw new NotFoundException(`Question ${id} non trouvée`);
    }

    return question;
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle question' })
  @ApiResponse({ status: 201, description: 'Question créée avec succès' })
  @ApiResponse({ status: 400, description: 'Mauvaise requête' })
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
      throw new Error(error);
    }
  }
}
