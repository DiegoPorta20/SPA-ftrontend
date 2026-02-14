import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { ClienteDialogComponent } from '../cliente-dialog/cliente-dialog.component';

/**
 * Componente de listado de clientes
 * - Tabla con paginación
 * - Búsqueda por nombre o DNI
 * - Acciones: ver, editar, eliminar
 */
@Component({
  selector: 'app-cliente-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatTooltipModule,
    MatChipsModule,
    ReactiveFormsModule
  ],
  templateUrl: './cliente-list.component.html',
  styleUrls: ['./cliente-list.component.scss']
})
export class ClienteListComponent implements OnInit {
  displayedColumns: string[] = ['dni', 'nombre', 'email', 'telefono', 'mascotas', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>([]);
  searchControl = new FormControl('');

  // Paginación
  totalItems = signal(0);
  currentPage = signal(1);
  pageSize = signal(10);
  pageSizeOptions = [5, 10, 25, 50];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClientes();
    this.setupSearch();
  }

  /**
   * Configurar búsqueda con debounce
   */
  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage.set(1);
        this.loadClientes();
      });
  }

  /**
   * Cargar clientes con paginación y búsqueda
   */
  loadClientes(): void {
    const search = this.searchControl.value || '';

    this.clienteService
      .getClientes(this.currentPage(), this.pageSize(), search)
      .subscribe({
        next: (response: any) => {
          // El API puede devolver un array directo o un objeto con data
          if (Array.isArray(response)) {
            // Si es un array directo
            this.dataSource.data = response;
            this.totalItems.set(response.length);
          } else if (response.data && Array.isArray(response.data)) {
            // Si viene en response.data (paginado)
            this.dataSource.data = response.data;
            this.totalItems.set(response.total || response.data.length);
          } else {
            // Fallback
            this.dataSource.data = [];
            this.totalItems.set(0);
          }
        },
        error: () => {
          this.dataSource.data = [];
          this.totalItems.set(0);
        }
      });
  }

  /**
   * Manejar cambio de página
   */
  onPageChange(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.currentPage.set(event.pageIndex + 1);
    this.loadClientes();
  }

  /**
   * Abrir modal para crear nuevo cliente
   */
  onCreate(): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { isEdit: false }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }

  /**
   * Abrir modal para editar cliente
   */
  onEdit(cliente: Cliente): void {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '800px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { isEdit: true, clienteId: cliente.id }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadClientes();
      }
    });
  }

  /**
   * Ver detalles del cliente
   */
  onView(cliente: Cliente): void {
    console.log('Navegando a detalle del cliente:', cliente);
    if (cliente && cliente.id) {
      this.router.navigate(['/clientes/detalle', cliente.id]);
    } else {
      this.notificationService.error('Cliente inválido');
    }
  }

  /**
   * Eliminar cliente con confirmación
   */
  onDelete(cliente: Cliente): void {
    const nombreCompleto = cliente.nombre_completo || `${cliente.nombres} ${cliente.apellidos}`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar al cliente ${nombreCompleto}? Esta acción también eliminará todas sus mascotas asociadas.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && cliente.id) {
        this.deleteCliente(cliente.id);
      }
    });
  }

  /**
   * Ejecutar eliminación
   */
  private deleteCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.notificationService.success('Cliente eliminado exitosamente');
        this.loadClientes();
      }
    });
  }

  /**
   * Limpiar búsqueda
   */
  clearSearch(): void {
    this.searchControl.setValue('');
  }
}



