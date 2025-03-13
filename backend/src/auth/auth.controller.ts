import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserWithoutPassword } from 'src/user/entities/user.entity';
import { LocalAuthGuard } from './guards/local.auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Enregistrer un utilisateur' })
  @ApiResponse({ status: 201, description: 'Utilisateur créé avec succès' })
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
  async login(@Body() loginDto: LoginDto) {
    return {
      message: 'Login successful',
    };
  }
}
