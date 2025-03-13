import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

interface MatchRequest {
  roomId: string;
  players: Socket[];
  acceptedPlayers: Set<string>;
  timer: NodeJS.Timeout;
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

  private queue: Socket[] = [];
  private matchRequests: Map<string, MatchRequest> = new Map();

  onModuleInit() {
    console.log("✅ WebSocket Gateway est démarré !");
    this.server.on('connection', (socket) => {
      console.log(`🔌 Nouvelle connexion : ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        this.removeFromQueue(socket.id);
        this.handleDisconnect(socket.id);
      });
    });
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ) {
    console.log(`📥 Le joueur ${client.id} a rejoint la file d'attente.`);

    if (this.queue.includes(client)) {
      client.emit('error', { message: 'Déjà dans la file d\'attente' });
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
          timer: setTimeout(() => this.handleMatchTimeout(roomId), 15000) // 15 secondes pour accepter
        };

        this.matchRequests.set(roomId, matchRequest);

        // Notifier les joueurs
        this.server.to(roomId).emit('matchFound', {
          roomId,
          players: [player1.id, player2.id],
          timeToAccept: 15
        });
      }
    }
  }

  @SubscribeMessage('acceptMatch')
  handleAcceptMatch(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { roomId: string }
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
      this.matchRequests.delete(data.roomId);

      // Démarrer la partie
      matchRequest.players.forEach((player, index) => {
        player.emit('gameStart', { isPlayer1: index === 0, roomId: data.roomId });
      });
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
    matchRequest.players.forEach(player => {
      player.emit('matchTimeout', { roomId });
    });

    this.matchRequests.delete(roomId);
  }

  private handleDisconnect(socketId: string) {
    // Vérifier si le joueur déconnecté était dans une demande de match
    for (const [roomId, matchRequest] of this.matchRequests.entries()) {
      if (matchRequest.players.some(player => player.id === socketId)) {
        // Notifier l'autre joueur
        matchRequest.players.forEach(player => {
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
    this.queue = this.queue.filter(socket => socket.id !== socketId);
  }
}
