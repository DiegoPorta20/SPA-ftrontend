import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Cliente } from '../../../../core/models/cliente.model';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../core/services/notification.service';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './cliente-detalle.component.html',
  styleUrls: ['./cliente-detalle.component.scss']
})
export class ClienteDetalleComponent implements OnInit {
  cliente = signal<Cliente | null>(null);
  loading = signal(true);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private clienteService: ClienteService,
    private notificationService: NotificationService
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
    this.loading.set(true);
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
        this.loading.set(false);
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.router.navigate(['/clientes']);
        this.loading.set(false);
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
}





