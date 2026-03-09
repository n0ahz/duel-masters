import { GameStatus, GameType } from '../enums/game.enum';
export interface GameInterface {
    id: string;
    name: string;
    inviterId: string;
    inviterName?: string;
    challengerId?: string;
    challengerName?: string;
    status: GameStatus;
    type: GameType;
    createdAt: Date | string;
    startedAt?: Date | string;
    endedAt?: Date | string;
    winnerId?: string;
}
