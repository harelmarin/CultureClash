import { Controller, Get, Param } from '@nestjs/common';
import { FollowService } from './follow.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Get(':id/follows')
  @ApiOperation({
    summary: "Obtenir la liste des utilisateurs suivis par l'utilisateur",
  })
  @ApiResponse({
    status: 200,
    description: 'Liste des utilisateurs suivis récupérée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getFollows(@Param('id') id: string) {
    return this.followService.getFollows(id);
  }

  @Get(':id/followers')
  @ApiOperation({ summary: "Obtenir la liste des abonnés de l'utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Liste des abonnés récupérée avec succès',
  })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async getFollowers(@Param('id') id: string) {
    return this.followService.getFollowers(id);
  }
}
