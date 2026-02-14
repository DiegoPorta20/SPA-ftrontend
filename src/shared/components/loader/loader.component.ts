import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoaderService } from '../../../core/services';

/**
 * Componente de loader global
 * Se muestra automáticamente durante las peticiones HTTP
 */
@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loaderService.loading$ | async) {
      <div class="loader-overlay">
        <div class="loader-container">
          <mat-spinner diameter="60" strokeWidth="4"></mat-spinner>
          <p class="loader-text">Cargando...</p>
        </div>
      </div>
    }
  `,
  styles: [`
    .loader-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(4px);
      animation: fadeIn 0.2s ease-in;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .loader-container {
      background: white;
      padding: 40px 50px;
      border-radius: 12px;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .loader-text {
      margin: 0;
      font-size: 16px;
      color: #424242;
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    mat-spinner {
      ::ng-deep circle {
        stroke: #3f51b5;
      }
    }
  `]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}

