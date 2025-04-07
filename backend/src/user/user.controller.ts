import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserWithoutPassword } from './entities/user.entity';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

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



  @Get('username/:name')
  @ApiOperation({ summary: 'Récupérer un utilisateur par username' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findbyUsername(@Param('name') name: string) {
    const user = await this.userService.findbyUsername(name);

    if (!user) {
      return {
        message: `Utilisateur ${name} non trouvé`,
      };
    }
    return user;
  }

  @Get('usernamev2/:name')
  @ApiOperation({ summary: 'Récupérer un utilisateur par username' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findbyUsernameWiithoutPassword(@Param('name') name: string) {
    return this.userService.findbyUsernameWithoutPassword(name);
  }

  @Get('email/:email')
  @ApiOperation({ summary: 'Récupérer un utilisateur par email' })
  @ApiResponse({ status: 200, description: 'Utilisateur trouvé' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findbyEmail(@Param('name') email: string) {
    const user = await this.userService.findbyEmail(email);

    if (!user) {
      return {
        message: `Utilisateur avec le mail ${email} non trouvé`,
      };
    }
    return user;
  }

  @Delete(':name')
  @ApiOperation({ summary: 'Delete un Utilisateur par son username' })
  @ApiResponse({ status: 200, description: 'Utilisateur Delete' })
  async delete(@Param('name') name: string) {
    return this.userService.delete(name);
  }

  @Patch('points')
  @ApiOperation({ summary: 'Update un Utilisateur par son username' })
  @ApiResponse({ status: 200, description: 'Utilisateur Update' })
  async update(
    @Body('winnerId') winnerId: string,
    @Body('loserId') loserId: string,
  ) {
    return this.userService.updatePoint(winnerId, loserId);
  }
}
