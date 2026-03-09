import { ZoneType } from '../enums/zone.enum';
import { CardInterface } from './card.interface';
export interface ZoneCardInterface<T = CardInterface> {
    id: string;
    card: T;
    zone: ZoneType;
    position: number;
    isTapped: boolean;
    isRevealed: boolean;
    ownerId: string;
}
