import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { GameType } from '@dm/shared';

@Component({
  selector: 'app-create-game-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  template: `
    <div class="dialog-wrap">
      <div class="dialog-header">
        <span class="dialog-header-tag">// INITIALIZE SESSION</span>
        <h2 class="dialog-title" mat-dialog-title>NEW DUEL</h2>
      </div>

      <mat-dialog-content class="dialog-content">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Session Name</mat-label>
          <input matInput [(ngModel)]="name" placeholder="ARENA_01" autocomplete="off" />
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Game Mode</mat-label>
          <mat-select [(ngModel)]="type">
            <mat-option [value]="GameType.STANDARD">
              <span class="option-label">◈ STANDARD</span>
            </mat-option>
            <mat-option [value]="GameType.CASUAL">
              <span class="option-label">◇ CASUAL</span>
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions class="dialog-actions">
        <button mat-button mat-dialog-close class="cancel-btn">ABORT</button>
        <button
          mat-raised-button
          color="primary"
          [disabled]="!name.trim()"
          (click)="create()"
          class="confirm-btn"
        >
          INITIALIZE
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .dialog-wrap {
      padding: 0;
    }
    .dialog-header {
      padding: 24px 24px 0;
    }
    .dialog-header-tag {
      font-family: var(--font-mono);
      font-size: 10px;
      color: var(--text-secondary);
      letter-spacing: 0.2em;
      display: block;
      margin-bottom: 4px;
    }
    .dialog-title {
      font-family: var(--font-display) !important;
      font-size: 18px !important;
      font-weight: 900 !important;
      color: var(--neon-cyan) !important;
      letter-spacing: 0.2em !important;
      margin: 0 !important;
      padding: 0 !important;
      text-shadow: 0 0 12px rgba(0, 245, 255, 0.4) !important;
    }
    .dialog-content {
      padding: 20px 24px !important;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .full-width { width: 100%; }
    .option-label {
      font-family: var(--font-mono);
      font-size: 13px;
      letter-spacing: 0.1em;
    }
    .dialog-actions {
      padding: 12px 20px 20px !important;
      justify-content: flex-end !important;
      gap: 10px !important;
    }
    .cancel-btn {
      font-family: var(--font-display) !important;
      font-size: 10px !important;
      letter-spacing: 0.18em !important;
      color: var(--text-secondary) !important;
    }
    .confirm-btn {
      min-width: 130px !important;
    }
  `],
})
export class CreateGameDialogComponent {
  name = '';
  type = GameType.STANDARD;
  readonly GameType = GameType;

  constructor(private dialogRef: MatDialogRef<CreateGameDialogComponent>) {}

  create(): void {
    this.dialogRef.close({ name: this.name.trim(), type: this.type });
  }
}
