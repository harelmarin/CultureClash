import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

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

  onModuleInit() {
    console.log("✅ WebSocket Gateway est démarré !");
    this.server.on('connection', (socket) => {
      console.log(`🔌 Nouvelle connexion : ${socket.id}`);

      socket.on('disconnect', () => {
        console.log(`❌ Déconnexion : ${socket.id}`);
        this.removeFromQueue(socket.id);
      });
    });
  }

  @SubscribeMessage('joinQueue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any
  ) {
    console.log(`📥 Le joueur ${client.id} a rejoint la file d'attente.`);

    // Vérifier si le joueur est déjà dans la file d'attente
    if (this.queue.includes(client)) {
      client.emit('error', { message: 'Déjà dans la file d\'attente' });
      return;
    }

    // Ajouter le client à la file d'attente
    this.queue.push(client);
    console.log(`Nombre de joueurs en attente : ${this.queue.length}`);

    // Lorsque 2 joueurs sont dans la file d'attente, commencer la partie
    if (this.queue.length >= 2) {
      const player1 = this.queue.shift();
      const player2 = this.queue.shift();

      if (player1 && player2) {
        const roomId = `match-${Date.now()}`;
        console.log(`🎮 Création du match dans la room ${roomId}`);

        player1.join(roomId);
        player2.join(roomId);

        this.server.to(roomId).emit('matchFound', {
          roomId,
          players: [player1.id, player2.id]
        });

        player1.emit('gameStart', { isPlayer1: true, roomId });
        player2.emit('gameStart', { isPlayer1: false, roomId });

        console.log(`✨ Match démarré entre ${player1.id} et ${player2.id}`);
      }
    }
  }

  @SubscribeMessage('leaveQueue')
  handleLeaveQueue(@ConnectedSocket() client: Socket) {
    this.removeFromQueue(client.id);
    client.emit('leftQueue');
    console.log(`📤 Le joueur ${client.id} a quitté la file d'attente.`);
  }

  private removeFromQueue(socketId: string) {
    this.queue = this.queue.filter(socket => socket.id !== socketId);
  }
}
