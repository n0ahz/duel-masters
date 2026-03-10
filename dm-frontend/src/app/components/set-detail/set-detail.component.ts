import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardsHttpService, Card } from '../../services/cards.service';


@Component({
  selector: 'app-set-detail',
  templateUrl: './set-detail.component.html',
  styleUrls: ['./set-detail.component.scss'],
  standalone: false
})
export class SetDetailComponent implements OnInit {
  setCode = '';
  cards: Card[] = [];
  loading = true;
  error = false;

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
      this.cardsService.getCardsBySet(this.setCode).subscribe({
        next: (cards) => {
          this.cards = cards;
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/cards']);
  }
}
