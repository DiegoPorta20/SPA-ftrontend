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
        <mat-spinner diameter="60" strokeWidth="4"></mat-spinner>
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
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
      backdrop-filter: blur(2px);
    }

    mat-spinner {
      ::ng-deep circle {
        stroke: #219ebc;
      }
    }
  `]
})
export class LoaderComponent {
  constructor(public loaderService: LoaderService) {}
}

