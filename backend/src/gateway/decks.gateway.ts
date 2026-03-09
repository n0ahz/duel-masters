import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameCommands, GameEvents } from '@dm/shared';
import { DecksService } from '../modules/decks/decks.service';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4200',
    credentials: true,
  },
})
export class DecksGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly decksService: DecksService) {}

  @SubscribeMessage(GameCommands.GET_DECKS)
  async handleGetDecks(@ConnectedSocket() socket: Socket) {
    try {
      const userId = socket.data.userId;
      if (!userId)
        return socket.emit(GameEvents.ERROR, { message: 'Not authenticated' });

      const decks = await this.decksService.getUserDecks(userId);
      socket.emit(
        GameEvents.DECKS_LIST,
        decks.map((d) => ({
          _id: (d as any)._id.toString(),
          userId: d.userId,
          name: d.name,
          cards: d.cards,
        })),
      );
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.CREATE_DECK)
  async handleCreateDeck(
    @MessageBody() data: { name: string; cards: { cardId: string; copies: number }[] },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      if (!userId)
        return socket.emit(GameEvents.ERROR, { message: 'Not authenticated' });

      const deck = await this.decksService.createDeck(
        userId,
        data.name,
        data.cards,
      );
      socket.emit(GameEvents.DECK_CREATED, {
        _id: (deck as any)._id.toString(),
        userId: deck.userId,
        name: deck.name,
        cards: deck.cards,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.UPDATE_DECK)
  async handleUpdateDeck(
    @MessageBody() data: { deckId: string; name: string; cards: { cardId: string; copies: number }[] },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      if (!userId)
        return socket.emit(GameEvents.ERROR, { message: 'Not authenticated' });

      const deck = await this.decksService.updateDeck(
        data.deckId,
        userId,
        data.name,
        data.cards,
      );
      socket.emit(GameEvents.DECK_UPDATED, {
        _id: (deck as any)._id.toString(),
        userId: deck.userId,
        name: deck.name,
        cards: deck.cards,
      });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }

  @SubscribeMessage(GameCommands.DELETE_DECK)
  async handleDeleteDeck(
    @MessageBody() data: { deckId: string },
    @ConnectedSocket() socket: Socket,
  ) {
    try {
      const userId = socket.data.userId;
      if (!userId)
        return socket.emit(GameEvents.ERROR, { message: 'Not authenticated' });

      await this.decksService.deleteDeck(data.deckId, userId);
      socket.emit(GameEvents.DECK_DELETED, { deckId: data.deckId });
    } catch (e) {
      socket.emit(GameEvents.ERROR, { message: e.message });
    }
  }
}
