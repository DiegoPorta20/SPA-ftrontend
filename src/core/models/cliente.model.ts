import { Mascota, MascotaDTO } from './mascota.model';

/**
 * Modelo de Cliente
 * Representa un cliente con sus mascotas asociadas
 */
export interface Cliente {
  id?: number;
  nombres: string;
  apellidos: string;
  nombre_completo?: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  estado?: string;
  mascotas?: Mascota[];
  mascotas_count?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * DTO para crear o actualizar un cliente
 * Incluye las mascotas en el mismo formulario
 */
export interface ClienteDTO {
  id?: number;
  nombres: string;
  apellidos: string;
  dni: string;
  email: string;
  telefono: string;
  direccion: string;
  mascotas: MascotaDTO[];
}

/**
 * Respuesta paginada de clientes
 */
export interface ClientesPaginados {
  data: Cliente[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

