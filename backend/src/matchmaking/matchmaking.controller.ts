import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { CreateMatchmakingDto } from './dto/create-matchmaking.dto';
import { UpdateMatchmakingDto } from './dto/update-matchmaking.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

@ApiTags('matchmaking')
@Controller('matchmaking')
export class MatchmakingController {
  constructor(private readonly matchmakingService: MatchmakingService) {}

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle session de matchmaking' })
  @ApiResponse({
    status: 201,
    description: 'Session de matchmaking créée avec succès.',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiBody({ type: CreateMatchmakingDto })
  create(@Body() createMatchmakingDto: CreateMatchmakingDto) {
    return this.matchmakingService.create(createMatchmakingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer toutes les sessions de matchmaking' })
  @ApiResponse({
    status: 200,
    description: 'Liste de toutes les sessions de matchmaking.',
  })
  @ApiResponse({
    status: 404,
    description: 'Aucune session de matchmaking trouvée.',
  })
  findAll() {
    return this.matchmakingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer une session de matchmaking par ID' })
  @ApiResponse({ status: 200, description: 'Session de matchmaking trouvée.' })
  @ApiResponse({
    status: 404,
    description: 'Session de matchmaking non trouvée.',
  })
  @ApiParam({ name: 'id', description: 'ID de la session de matchmaking' })
  findOne(@Param('id') id: string) {
    return this.matchmakingService.findOne(id);
  }
}
