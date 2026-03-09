import { GameCommands } from '../enums/gateway/game-commands.enum';
export interface SocketPayloadInterface<T = unknown> {
    event?: GameCommands;
    data: T;
    gameId?: string;
    userId?: string;
}
