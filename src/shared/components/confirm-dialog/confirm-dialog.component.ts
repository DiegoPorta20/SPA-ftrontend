import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

/**
 * Componente de diálogo de confirmación reutilizable
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-icon">
        <mat-icon color="warn">warning_amber</mat-icon>
      </div>

      <h2 mat-dialog-title>{{ data.title }}</h2>

      <mat-dialog-content>
        <p class="message">{{ data.message }}</p>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()" class="cancel-btn">
          {{ data.cancelText || 'Cancelar' }}
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()" class="confirm-btn">
          <mat-icon>delete</mat-icon>
          {{ data.confirmText || 'Confirmar' }}
        </button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .confirm-dialog {
      padding: 8px;
      font-family: 'Poppins', sans-serif;
    }

    .dialog-icon {
      display: flex;
      justify-content: center;
      margin-bottom: 16px;

      mat-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #f59e0b;
      }
    }

    h2 {
      text-align: center;
      margin: 0 0 16px 0;
      font-size: 24px;
      font-weight: 600;
      color: #1f2937;
    }

    mat-dialog-content {
      padding: 0 16px 24px 16px;
      min-width: 350px;
      max-width: 500px;

      .message {
        text-align: center;
        color: #6b7280;
        font-size: 15px;
        line-height: 1.6;
        margin: 0;
      }
    }

    mat-dialog-actions {
      padding: 16px;
      gap: 12px;
      border-top: 1px solid #e5e7eb;

      .cancel-btn {
        font-weight: 500;
        font-family: 'Poppins', sans-serif;
        padding: 0 24px;
      }

      .confirm-btn {
        font-weight: 500;
        font-family: 'Poppins', sans-serif;
        padding: 0 24px;

        mat-icon {
          margin-right: 8px;
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
  ) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

