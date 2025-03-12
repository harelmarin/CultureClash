import { OnModuleInit } from "@nestjs/common";
import { ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';

interface PlayerData {
  socketId: string;
}

@WebSocketGateway({
  cors: { origin: "*" },
  namespace: '/'
})
export class MyGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  private queue: Socket[] = [];

  onModuleInit() {
    console.log("✅ WebSocket Gateway est démarré !");
  }

  @SubscribeMessage('chat')
  handleChat(
    @MessageBody() message: string,
    @ConnectedSocket() client: Socket
  ) {
    console.log(`📬 Message reçu de ${client.id} : ${message}`);
    this.server.emit('chat', { message, sender: client.id });
  }


  @SubscribeMessage('joinQueue')
  handleJoinQueue(
    @ConnectedSocket() client: Socket
  ) {

    if (this.queue.includes(client)) {
      client.emit('error', {
        message: 'Déjà dans la file d attente'
      });
      return;
    }

    this.queue.push(client);
    console.log(`📥 Le joueur ${client.id} a rejoint la file d'attente.`);
    console.log(`Nombre de joueurs en attente : ${this.queue.length}`);

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
  }

  private removeFromQueue(socketId: string) {
    this.queue = this.queue.filter(player => player.id !== socketId);
    console.log(`📤 Le joueur ${socketId} a quitté la file d'attente.`);
  }

  handleDisconnect(client: Socket) {
    this.removeFromQueue(client.id);
    console.log(`❌ Le joueur ${client.id} s'est déconnecté`);
  }
}
