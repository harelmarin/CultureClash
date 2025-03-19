import { Injectable } from '@nestjs/common';
import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { SessionService } from '../session/session.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(private readonly sessionService: SessionService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const sessionId = request.headers['x-session-id'];

    if (!sessionId) {
      throw new UnauthorizedException('Session ID manquant');
    }

    const session = await this.sessionService.getSession(sessionId);
    if (!session || !session.user) {
      throw new UnauthorizedException('Session invalide');
    }

    // Stocker l'utilisateur dans la requête pour une utilisation ultérieure
    request.user = session.user;
    return true;
  }
}
