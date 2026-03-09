import { Civilization, CardType, Rarity } from '../enums/card.enum';
export interface CardPrinting {
    set: string;
    id: string;
    rarity: Rarity | string;
    illustrator?: string;
    flavor?: string;
}
export interface CardInterface {
    _id?: string;
    name: string;
    civilizations: (Civilization | string)[];
    cost: number;
    power?: string;
    type: CardType | string;
    subtypes?: string[];
    supertypes?: string[];
    text?: string;
    printings: CardPrinting[];
}
