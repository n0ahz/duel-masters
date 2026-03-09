export interface DeckCardEntry {
  cardId: string;
  copies: number;
}

export interface DeckInterface {
  _id?: string;
  userId: string;
  name: string;
  cards: DeckCardEntry[];
}
