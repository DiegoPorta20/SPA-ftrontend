import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para mostrar/ocultar el loader global
 */
@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private requestCount = 0;

  /**
   * Observable para suscribirse al estado del loader
   */
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Muestra el loader global
   */
  show(): void {
    this.requestCount++;
    // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loadingSubject.next(true);
    }, 0);
  }

  /**
   * Oculta el loader global
   * Solo oculta cuando todas las peticiones han finalizado
   */
  hide(): void {
    this.requestCount--;
    if (this.requestCount <= 0) {
      this.requestCount = 0;
      // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
      setTimeout(() => {
        this.loadingSubject.next(false);
      }, 0);
    }
  }

  /**
   * Fuerza el ocultamiento del loader
   */
  forceHide(): void {
    this.requestCount = 0;
    // Usar setTimeout para evitar ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
      this.loadingSubject.next(false);
    }, 0);
  }
}

