export interface SetInterface {
  id: string;
  name: string;
  fullName?: string;
  serial: number;
  noOfCards: number;
  year?: number;
  imageUrls?: string[];
  puzzleImageUrls?: string[];
  description?: string;
}
