import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/user/entities/user.entity';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { SessionAuthGuard } from './guards/session.auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un utilisateur' })
  @ApiResponse({
    status: 201,
    description: 'Utilisateur créé avec succès',
    type: UserWithoutPassword,
  })
  @ApiResponse({ status: 409, description: 'Email ou Username déjà pris' })
  @ApiResponse({ status: 500, description: 'Erreur interne' })
  async register(
    @Body() registerDto: RegisterDto,
  ): Promise<UserWithoutPassword> {
    try {
      const user = await this.authService.register(registerDto);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: "Connexion d'un utilisateur" })
  @ApiResponse({
    status: 200,
    description: 'Login réussi',
    type: UserWithoutPassword,
  })
  @ApiResponse({ status: 401, description: 'Identifiants invalides' })
  async login(@Request() req, @Body() loginDto: LoginDto) {
    req.session.user = req.user;
    console.log('Session créée:', req.session);
    return { message: 'Login réussi', user: req.user };
  }

  @Post('logout')
  @ApiOperation({ summary: "Déconnexion d'un utilisateur" })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async logout(@Request() req, @Res() res) {
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la destruction de la session:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Déconnexion réussie' });
    });
  }

  @Get('me')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({
    summary: "Récupérer les informations de l'utilisateur connecté",
  })
  @ApiResponse({
    status: 200,
    description: 'Utilisateur récupéré',
    type: UserWithoutPassword,
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  getMe(@Request() req) {
    if (!req.session.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return req.session.user;
  }
}
