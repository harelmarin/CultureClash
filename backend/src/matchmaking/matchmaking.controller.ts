import { Controller, Get, Post, Body, Patch, Param } from '@nestjs/common';
import { MatchmakingService } from './matchmaking.service';
import { CreateMatchmakingDto } from './dto/create-matchmaking.dto';

import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';
import { EndGameDto } from './dto/end-game.dto';

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

  @Patch()
  @ApiOperation({ summary: 'Update la session de matchmaking à la fin' })
  @ApiResponse({
    status: 201,
    description: 'Session de matchmaking udpate avec succès.',
  })
  @ApiResponse({ status: 400, description: 'Données invalides.' })
  @ApiBody({ type: EndGameDto })
  endgame(@Body() endgameDto: EndGameDto) {
    return this.matchmakingService.endgame(endgameDto);
  }

  @Get('user/:id')
  @ApiOperation({ summary: 'Récupère les matchs d un joueur par son id' })
  @ApiResponse({
    status: 201,
    description: 'Récupéré avec succès .',
  })
  @ApiResponse({ status: 400, description: 'Problème à la récupération' })
  getUserMatchmakingSession(@Param('id') id: string) {
    return this.matchmakingService.getUserMatchmakingSessions(id);
  }
}
