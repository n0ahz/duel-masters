import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CardPrinting {
  set: string;
  id: string;
  rarity: string;
  illustrator: string;
  flavor?: string;
}

export interface Card {
  _id: string;
  name: string;
  civilizations: string[];
  type: string;
  cost: number;
  power?: string;
  text?: string;
  subtypes?: string[];
  supertypes?: string[];
  printings: CardPrinting[];
}

@Injectable({ providedIn: 'root' })
export class CardsHttpService {
  private readonly api = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getCardsBySet(setCode: string): Observable<Card[]> {
    return this.http.get<Card[]>(`${this.api}/cards`, { params: { set: setCode } });
  }
}
