import {
  Body,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User, UserWithoutPassword } from './entities/user.entity';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from 'src/auth/dto/login.dto';
import { register } from 'node:module';
import { RegisterDto } from 'src/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    try {
      const users = await this.prisma.user.findMany();
      return users;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: id,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findbyUsername(name: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          username: name,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async findbyEmail(email: string): Promise<User> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          email: email,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async delete(name: string): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.delete({
        where: {
          username: name,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async create(@Body() registerDto: RegisterDto): Promise<UserWithoutPassword> {
    try {
      const user = await this.prisma.user.create({
        data: {
          username: registerDto.username,
          email: registerDto.email,
          password: registerDto.password,
        },
      });
      return user;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
