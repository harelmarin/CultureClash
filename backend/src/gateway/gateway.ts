import { OnModuleInit, Inject } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MatchmakingService } from '../matchmaking/matchmaking.service';
import { UserService } from '../user/user.service';

interface MatchRequest {
  roomId: string;
  players: Socket[];
  acceptedPlayers: Set<string>;
  timer: NodeJS.Timeout;
}

interface ConnectedUser {
  userId: string;
  socketIds: Set<string>;
  activeSocketId?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly matchmakingService: MatchmakingService,
    private readonly userService: UserService,
  ) {}

  private queue: Socket[] = [];
  private matchRequests: Map<string, MatchRequest> = new Map();
  private connectedUsers: Map<string, ConnectedUser> = new Map();

  onModuleInit() {
    console.log('✅ WebSocket Gateway est démarré !');
    this.server.on('connection', (socket) => {
      console.log(`🔌 Nouvelle connexion : ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        this.removeFromQueue(socket.id);
        this.handleDisconnect(socket.id);

        if (socket.data?.userId) {
          const userConnections = this.connectedUsers.get(socket.data.userId);
          if (userConnections) {
            userConnections.socketIds.delete(socket.id);

            if (userConnections.activeSocketId === socket.id) {
              userConnections.activeSocketId = undefined;
            }
            if (userConnections.socketIds.size === 0) {
              this.connectedUsers.delete(socket.data.userId);
            }
          }
        }
      });
    });
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    if (data && data.userId) {
      client.data = { ...client.data, userId: data.userId };

      let userConnections = this.connectedUsers.get(data.userId);
      if (!userConnections) {
        userConnections = {
          userId: data.userId,
          socketIds: new Set([client.id]),
          activeSocketId: client.id,
        };
        this.connectedUsers.set(data.userId, userConnections);
      } else {
        userConnections.socketIds.add(client.id);

        if (!userConnections.activeSocketId) {
          userConnections.activeSocketId = client.id;
        }
      }
    }
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId?: string } = {},
  ) {
    const userId = data?.userId || client.id;

    console.log(
      `📥 Le joueur ${client.id} (userId: ${userId}) a rejoint la file d'attente.`,
    );

    client.data = { ...client.data, userId };

    const userConnections = this.connectedUsers.get(userId);
    if (userConnections) {
      userConnections.activeSocketId = client.id;
    } else {
      this.connectedUsers.set(userId, {
        userId,
        socketIds: new Set([client.id]),
        activeSocketId: client.id,
      });
    }
    const isUserInQueue = this.queue.some(
      (socket) => socket.data?.userId === userId && socket.id !== client.id,
    );

    if (isUserInQueue || this.queue.includes(client)) {
      client.emit('error', { message: "Déjà dans la file d'attente" });
      return;
    }

    this.queue.push(client);
    console.log(`Nombre de joueurs en attente : ${this.queue.length}`);

    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();

      if (player1 && player2) {
        const roomId = `match-${Date.now()}`;
        console.log(`🎮 Création du match dans la room ${roomId}`);

        player1.join(roomId);
        player2.join(roomId);

        // Créer une nouvelle demande de match
        const matchRequest: MatchRequest = {
          roomId,
          players: [player1, player2],
          acceptedPlayers: new Set(),
          timer: setTimeout(() => this.handleMatchTimeout(roomId), 15000), // 15 secondes pour accepter
        };

        this.matchRequests.set(roomId, matchRequest);

        // Notifier les joueurs
        this.server.to(roomId).emit('matchFound', {
          roomId,
          players: [player1.id, player2.id],
          timeToAccept: 15,
        });
      }
    }
  }

  @SubscribeMessage('acceptMatch')
  async handleAcceptMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string },
  ) {
    const matchRequest = this.matchRequests.get(data.roomId);
    if (!matchRequest) {
      client.emit('error', { message: 'Match non trouvé' });
      return;
    }

    matchRequest.acceptedPlayers.add(client.id);
    console.log(`✅ Le joueur ${client.id} a accepté le match`);

    // Vérifier si tous les joueurs ont accepté
    if (matchRequest.acceptedPlayers.size === matchRequest.players.length) {
      clearTimeout(matchRequest.timer);

      try {
        // Get user IDs from socket data
        const player1UserId = matchRequest.players[0].data?.userId;
        const player2UserId = matchRequest.players[1].data?.userId;

        if (!player1UserId || !player2UserId) {
          throw new Error('User IDs not found in socket data');
        }

        const player1Exists = await this.userService.findOne(player1UserId);
        const player2Exists = await this.userService.findOne(player2UserId);

        if (!player1Exists || !player2Exists) {
          throw new Error('One or both users do not exist in the database');
        }

        const matchmaking = await this.matchmakingService.create({
          playerOneId: player1UserId,
          playerTwoId: player2UserId,
        });

        console.log(`🎲 Matchmaking créé avec ID: ${matchmaking.id}`);

        this.matchRequests.delete(data.roomId);

        matchRequest.players.forEach((player, index) => {
          player.emit('gameStart', {
            isPlayer1: index === 0,
            roomId: data.roomId,
            matchmaking: {
              id: matchmaking.id,
              playerOneId: player1UserId,
              playerTwoId: player2UserId,
              questions: matchmaking.questions,
              status: matchmaking.status,
              createdAt: matchmaking.createdAt,
            },
          });
        });
      } catch (error) {
        console.error('Error creating matchmaking:', error);

        matchRequest.players.forEach((player) => {
          player.emit('error', {
            message: 'Erreur lors de la création du match',
            details: error.message,
          });
        });
        this.matchRequests.delete(data.roomId);
      }
    }
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.removeFromQueue(client.id);
    client.emit('leftQueue');
    console.log(`📤 Le joueur ${client.id} a quitté la file d'attente.`);
  }

  private handleMatchTimeout(roomId: string) {
    const matchRequest = this.matchRequests.get(roomId);
    if (!matchRequest) return;

    // Notifier les joueurs que le match a expiré
    matchRequest.players.forEach((player) => {
      player.emit('matchTimeout', { roomId });
    });

    this.matchRequests.delete(roomId);
  }

  private handleDisconnect(socketId: string) {
    // Vérifier si le joueur déconnecté était dans une demande de match
    for (const [roomId, matchRequest] of this.matchRequests.entries()) {
      if (matchRequest.players.some((player) => player.id === socketId)) {
        // Notifier l'autre joueur
        matchRequest.players.forEach((player) => {
          if (player.id !== socketId) {
            player.emit('playerLeft', { roomId });
          }
        });

        clearTimeout(matchRequest.timer);
        this.matchRequests.delete(roomId);
        break;
      }
    }
  }

  private removeFromQueue(socketId: string) {
    this.queue = this.queue.filter((socket) => socket.id !== socketId);
  }
}
