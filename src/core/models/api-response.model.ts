/**
 * Respuesta de API genérica
 */
export interface ApiResponse<T> {
  data?: T;
  message?: string;
  errors?: { [key: string]: string[] };
  success?: boolean;
}

/**
 * Error de API
 */
export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}

