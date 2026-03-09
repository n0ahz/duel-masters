import { Injectable, DestroyRef, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { GameEvents } from '@dm/shared';
import { SocketService } from './socket.service';

@Injectable({ providedIn: 'root' })
export class ErrorService {
  private destroyRef = inject(DestroyRef);

  constructor(
    private socketService: SocketService,
    private snackBar: MatSnackBar,
  ) {
    this.socketService
      .on<{ message: string }>(GameEvents.ERROR)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((err) => {
        this.snackBar.open(err.message, 'Close', {
          duration: 4000,
          panelClass: 'error-snackbar',
        });
      });
  }
}
