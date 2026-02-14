import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, throwError } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { NotificationService } from '../services/notification.service';

/**
 * Interceptor HTTP global
 * - Muestra/oculta el loader automáticamente
 * - Maneja errores de API de forma centralizada
 * - Agrega headers necesarios
 */
export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const loaderService = inject(LoaderService);
  const notificationService = inject(NotificationService);

  // Mostrar loader
  loaderService.show();

  // Clonar la petición y agregar headers si es necesario
  const clonedRequest = req.clone({
    setHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error inesperado';

      if (error.error instanceof ErrorEvent) {
        // Error del lado del cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Error del lado del servidor
        if (error.status === 0) {
          errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión.';
        } else if (error.status === 404) {
          errorMessage = 'Recurso no encontrado';
        } else if (error.status === 422) {
          // Errores de validación de Laravel
          const validationErrors = error.error?.errors;
          if (validationErrors) {
            const firstError = Object.values(validationErrors)[0] as string[];
            errorMessage = firstError[0] || 'Error de validación';
          } else {
            errorMessage = error.error?.message || 'Error de validación';
          }
        } else if (error.status === 500) {
          errorMessage = 'Error interno del servidor';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }
      }

      // Mostrar notificación de error
      notificationService.error(errorMessage);

      return throwError(() => ({
        message: errorMessage,
        status: error.status,
        errors: error.error?.errors
      }));
    }),
    finalize(() => {
      // Ocultar loader cuando termine la petición
      loaderService.hide();
    })
  );
};

