import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les utilisateurs' })
  @ApiResponse({ status: 200, description: 'Liste de tous les utilisateurs' })
  @ApiResponse({ status: 404, description: 'Aucun utilisateur trouvé' })
  async findAll() {
    const users = await this.userService.findAll();

    if (users.length === 0) {
      return {
        message: 'Aucun utilisateur trouvé',
      };
    }

    return users;
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un utilisateur par ID' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);

    if (!user) {
      return {
        message: `Utilisateur ${id} non trouvé`,
      };
    }

    return user;
  }
}
