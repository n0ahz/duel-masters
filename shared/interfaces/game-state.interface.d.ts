import { Phase } from '../enums/phase.enum';
import { ZoneType } from '../enums/zone.enum';
import { ZoneCardInterface } from './zone-card.interface';
export interface PlayerZones {
    [ZoneType.DECK]: ZoneCardInterface[];
    [ZoneType.HAND]: ZoneCardInterface[];
    [ZoneType.SHIELDS]: ZoneCardInterface[];
    [ZoneType.BATTLE_ZONE]: ZoneCardInterface[];
    [ZoneType.GRAVEYARD]: ZoneCardInterface[];
    [ZoneType.MANA]: ZoneCardInterface[];
}
export interface PlayerState {
    userId: string;
    username: string;
    zones: PlayerZones;
    isFirstPlayer: boolean;
}
export interface GameStateInterface {
    gameId: string;
    players: Record<string, PlayerState>;
    currentPhase: Phase;
    currentTurn: number;
    activePlayerId: string;
    turnNumber: number;
}
