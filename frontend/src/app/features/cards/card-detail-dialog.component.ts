import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { CardInterface } from '@dm/shared';

@Component({
  selector: 'app-card-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatDividerModule],
  template: `
    <h2 mat-dialog-title>{{ card.name }}</h2>
    <mat-dialog-content>
      <p><strong>Civilizations:</strong> {{ card.civilizations?.join(', ') }}</p>
      <p><strong>Type:</strong> {{ card.type }}</p>
      <p><strong>Mana Cost:</strong> {{ card.cost }}</p>
      <p *ngIf="card.power"><strong>Power:</strong> {{ card.power }}</p>
      <p *ngIf="card.subtypes?.length"><strong>Subtypes:</strong> {{ card.subtypes?.join(', ') }}</p>
      <p *ngIf="card.supertypes?.length"><strong>Supertypes:</strong> {{ card.supertypes?.join(', ') }}</p>
      <p *ngIf="card.text"><strong>Ability:</strong> {{ card.text }}</p>

      <mat-divider style="margin: 12px 0"></mat-divider>

      <div *ngFor="let p of card.printings" style="margin-bottom:8px">
        <p style="margin:0"><strong>{{ p.set }}</strong> — #{{ p.id }} ({{ p.rarity }})</p>
        <p *ngIf="p.illustrator" style="margin:0;color:#aaa;font-size:12px">Art: {{ p.illustrator }}</p>
        <p *ngIf="p.flavor" style="margin:4px 0 0;font-style:italic;color:#888;font-size:12px">
          "{{ p.flavor }}"
        </p>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class CardDetailDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public card: CardInterface) {}
}
