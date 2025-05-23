import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Res,
  UnauthorizedException,
  Headers,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/user/entities/user.entity';
import { LocalAuthGuard } from './guards/local.auth.guard';
import { SessionAuthGuard } from './guards/session.auth.guard';
import { SessionService } from './session/session.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
  ) { }

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
  async login(
    @Request() req,
    @Body() loginDto: LoginDto,
    @Headers('x-session-id') sessionId: string,
  ) {
    if (!sessionId) {
      throw new UnauthorizedException('Session ID manquant');
    }

    const session = await this.sessionService.createSession(
      req.user.id,
      sessionId,
    );
    return { message: 'Login réussi', user: req.user };
  }

  @Post('logout')
  @ApiOperation({ summary: "Déconnexion d'un utilisateur" })
  @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async logout(
    @Request() req,
    @Res() res,
    @Headers('x-session-id') sessionId: string,
  ) {
    if (sessionId) {
      await this.sessionService.deleteSession(sessionId);
    }
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
  async getMe(
    @Request() req,
    @Headers('x-session-id') sessionId: string,
  ) {
    if (!sessionId) {
      throw new UnauthorizedException('Session ID manquant');
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session || !session.user) {
      throw new UnauthorizedException('Session invalide');
    }

    return session.user;
  }

  @Get('refresh-session')
  async refreshSession(
    @Request() req,
    @Res() res,
    @Headers('x-session-id') sessionId: string,
  ) {
    if (!sessionId) {
      throw new UnauthorizedException('Session ID manquant');
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session || !session.user) {
      throw new UnauthorizedException('Session invalide');
    }

    await this.sessionService.updateSession(sessionId);
    req.session.touch();

    res.json({ message: 'Session rafraîchie', user: session.user });
  }

  @Get('check-session')
  @UseGuards(SessionAuthGuard)
  @ApiOperation({ summary: "Vérifier si l'utilisateur est connecté" })
  @ApiResponse({
    status: 200,
    description: 'Session valide',
    type: UserWithoutPassword,
  })
  @ApiResponse({
    status: 401,
    description: 'Session expirée ou utilisateur non connecté',
  })
  async checkSession(
    @Request() req,
    @Headers('x-session-id') sessionId: string,
  ) {
    if (!sessionId) {
      throw new UnauthorizedException('Session ID manquant');
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session || !session.user) {
      throw new UnauthorizedException('Session invalide');
    }

    return session.user;
  }

  @Post('clear-session')
  @ApiOperation({ summary: "Effacer la session de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Session effacée avec succès' })
  @ApiResponse({ status: 500, description: 'Erreur serveur' })
  async clearSession(
    @Request() req,
    @Res() res,
    @Headers('x-session-id') sessionId: string,
  ) {
    if (sessionId) {
      await this.sessionService.deleteSession(sessionId);
    }
    req.session.destroy((err) => {
      if (err) {
        console.error('Erreur lors de la destruction de la session:', err);
        return res.status(500).json({ message: 'Erreur serveur' });
      }
      res.clearCookie('connect.sid');
      return res.json({ message: 'Session effacée' });
    });
  }
}
