import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CardsHttpService, Card, SetInfo } from '../../services/cards.service';


@Component({
  selector: 'app-set-detail',
  templateUrl: './set-detail.component.html',
  styleUrls: ['./set-detail.component.scss'],
  standalone: false
})
export class SetDetailComponent implements OnInit {
  setCode = '';
  cards: Card[] = [];
  setInfo: SetInfo | null = null;
  loading = true;
  error = false;
  selectedCard: Card | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardsService: CardsHttpService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.setCode = params.get('setCode') ?? '';
      this.loading = true;
      this.error = false;
      this.setInfo = null;

      forkJoin({
        cards: this.cardsService.getCardsBySet(this.setCode).pipe(catchError(() => of([]))),
        setInfo: this.cardsService.getSetInfo(this.setCode).pipe(catchError(() => of(null))),
      }).subscribe({
        next: ({ cards, setInfo }) => {
          this.setInfo = setInfo;
          this.cards = this.sortCardsByPrintingId(cards, this.setCode);
          this.loading = false;
          if (!cards.length && !setInfo) this.error = true;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    });
  }

  private sortCardsByPrintingId(cards: Card[], setCode: string): Card[] {
    return [...cards].sort((a, b) => {
      const pa = this.getPrintingForSet(a, setCode);
      const pb = this.getPrintingForSet(b, setCode);
      return this.parseId(pa?.id) - this.parseId(pb?.id);
    });
  }

  private getPrintingForSet(card: Card, setCode: string) {
    return card.printings.find(p => p.set.startsWith(setCode));
  }

  private parseId(id?: string): number {
    if (!id) return Infinity;
    const n = parseInt(id.split('/')[0], 10);
    return isNaN(n) ? Infinity : n;
  }

  getPrintingId(card: Card): string {
    return this.getPrintingForSet(card, this.setCode)?.id ?? '';
  }

  getRarity(card: Card): string {
    return this.getPrintingForSet(card, this.setCode)?.rarity ?? '';
  }

  openCard(card: Card): void {
    this.selectedCard = card;
  }

  closeCard(): void {
    this.selectedCard = null;
  }

  goBack(): void {
    this.router.navigate(['/cards']);
  }
}
