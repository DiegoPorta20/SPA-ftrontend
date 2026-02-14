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
 * Respuesta paginada de Laravel
 */
export interface PaginatedResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    path: string;
    per_page: number;
    to: number;
    total: number;
    links: {
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }[];
  };
}

/**
 * Error de API
 */
export interface ApiError {
  message: string;
  errors?: { [key: string]: string[] };
  status?: number;
}

