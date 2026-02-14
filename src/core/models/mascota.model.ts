/**
 * Modelo de Mascota
 * Representa una mascota asociada a un cliente
 */
export interface Mascota {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
  cliente_id?: number;
  created_at?: string;
  updated_at?: string;
}

/**
 * DTO para crear o actualizar una mascota
 */
export interface MascotaDTO {
  id?: number;
  nombre: string;
  especie: string;
  raza: string;
  edad: number;
}

