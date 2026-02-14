import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../enviroment/enviroment';
import { Cliente, ClienteDTO, ApiResponse } from '../../../core/models';

/**
 * Servicio para gestionar clientes y sus mascotas
 * Implementa todas las operaciones CRUD contra la API Laravel
 */
@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private readonly apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene listado paginado de clientes con búsqueda opcional
   * @param page Número de página
   * @param perPage Elementos por página
   * @param search Término de búsqueda (nombre o DNI)
   */
  getClientes(page: number = 1, perPage: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * Obtiene un cliente por ID con sus mascotas
   * @param id ID del cliente
   */
  getCliente(id: number): Observable<ApiResponse<Cliente>> {
    return this.http.get<ApiResponse<Cliente>>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo cliente con sus mascotas
   * @param clienteDTO Datos del cliente y mascotas
   */
  createCliente(clienteDTO: ClienteDTO): Observable<ApiResponse<Cliente>> {
    return this.http.post<ApiResponse<Cliente>>(this.apiUrl, clienteDTO);
  }

  /**
   * Actualiza un cliente existente y sincroniza sus mascotas
   * - Crea nuevas mascotas (sin ID)
   * - Actualiza mascotas existentes (con ID)
   * - Elimina mascotas que no vienen en el array
   * @param id ID del cliente
   * @param clienteDTO Datos actualizados del cliente y mascotas
   */
  updateCliente(id: number, clienteDTO: ClienteDTO): Observable<ApiResponse<Cliente>> {
    return this.http.put<ApiResponse<Cliente>>(`${this.apiUrl}/${id}`, clienteDTO);
  }

  /**
   * Elimina un cliente y sus mascotas asociadas
   * @param id ID del cliente
   */
  deleteCliente(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`);
  }
}

