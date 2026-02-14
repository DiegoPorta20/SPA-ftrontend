import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

/**
 * Componente de detalle del cliente
 * Muestra toda la información del cliente y sus mascotas
 */
@Component({
  selector: 'app-cliente-detalle',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatChipsModule,
    MatTooltipModule
  ],
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.scss']
})
export class ClienteDetalleComponent implements OnInit {
  cliente = signal<Cliente | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCliente(Number(id));
    } else {
      this.router.navigate(['/clientes']);
    }
  }

  private loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe({
      next: (response: any) => {
        // El API puede devolver data directamente o en response.data
        const clienteData: Cliente = response.data || response;

        if (clienteData && clienteData.nombres && clienteData.apellidos) {
          this.cliente.set(clienteData);
        } else {
          this.notificationService.error('No se encontró el cliente');
          this.router.navigate(['/clientes']);
        }
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.router.navigate(['/clientes']);
      }
    });
  }

  onBack(): void {
    this.router.navigate(['/clientes']);
  }

  onEdit(): void {
    const clienteActual = this.cliente();
    if (clienteActual?.id) {
      this.router.navigate(['/clientes/editar', clienteActual.id]);
    }
  }

  onDelete(): void {
    const clienteActual = this.cliente();
    if (!clienteActual) return;

    const nombreCompleto = clienteActual.nombre_completo || `${clienteActual.nombres} ${clienteActual.apellidos}`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '450px',
      data: {
        title: 'Confirmar eliminación',
        message: `¿Está seguro que desea eliminar al cliente ${nombreCompleto}? Esta acción también eliminará todas sus mascotas asociadas y no se puede deshacer.`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && clienteActual.id) {
        this.deleteCliente(clienteActual.id);
      }
    });
  }

  private deleteCliente(id: number): void {
    this.clienteService.deleteCliente(id).subscribe({
      next: () => {
        this.notificationService.success('Cliente eliminado exitosamente');
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.notificationService.error('Error al eliminar el cliente');
      }
    });
  }
}






