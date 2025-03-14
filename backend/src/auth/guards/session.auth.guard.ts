import { Injectable } from '@nestjs/common';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (!request.session || !request.session.user) {
      throw new UnauthorizedException('Utilisateur non authentifié');
    }
    return true;
  }
}
