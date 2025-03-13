import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Vérifie si l'username n'est pas déjà pris
    const userbyUsername = await this.userService.findbyUsername(
      registerDto.username,
    );
    if (userbyUsername) {
      throw new ConflictException('Username Déjà pris');
    }

    // Vérifie si le mail n'est pas déjà pris
    const userbyEmail = await this.userService.findbyEmail(registerDto.email);
    if (userbyEmail) {
      throw new ConflictException('Email Déjà pris');
    }

    // Si ni mail ni username ne sont pris => Hash du password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);

    // Je peux donc enregistrer l'utilisateur dans ma bdd avec le password hashé
    const user = await this.prisma.user.create({
      data: {
        email: registerDto.email,
        username: registerDto.username,
        password: hashedPassword,
      },
    });

    const { password, ...userWithoutPassword } = user;

    // Retourne l'utilisateur sans le password
    return userWithoutPassword;
  }
}
