import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

/**
 * Servicio para mostrar notificaciones al usuario
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private defaultConfig: MatSnackBarConfig = {
    duration: 4000,
    horizontalPosition: 'end',
    verticalPosition: 'top'
  };

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Muestra una notificación de éxito
   */
  success(message: string, duration: number = 4000): void {
    this.snackBar.open(message, '✕', {
      ...this.defaultConfig,
      duration,
      panelClass: ['notification-success']
    });
  }

  /**
   * Muestra una notificación de error
   */
  error(message: string, duration: number = 6000): void {
    this.snackBar.open(message, '✕', {
      ...this.defaultConfig,
      duration,
      panelClass: ['notification-error']
    });
  }

  /**
   * Muestra una notificación de información
   */
  info(message: string, duration: number = 4000): void {
    this.snackBar.open(message, '✕', {
      ...this.defaultConfig,
      duration,
      panelClass: ['notification-info']
    });
  }

  /**
   * Muestra una notificación de advertencia
   */
  warning(message: string, duration: number = 5000): void {
    this.snackBar.open(message, '✕', {
      ...this.defaultConfig,
      duration,
      panelClass: ['notification-warning']
    });
  }
}

