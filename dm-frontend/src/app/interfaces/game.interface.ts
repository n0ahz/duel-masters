import { GameStatusEnum, GameTypesEnum } from '../enums/games.enum';


export interface GameInterface {
  name: string;
  inviter: string;
  gameType?: GameTypesEnum;
  gameIdentifier?: string;
  challenger?: string;
  firstToGo?: string;
  createdAt: string;
  endedAt?: string;
  status?: GameStatusEnum;
}
