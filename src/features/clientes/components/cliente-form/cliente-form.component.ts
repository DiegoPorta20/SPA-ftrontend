import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ClienteDTO } from '../../../../core/models/cliente.model';
import { MascotaDTO } from '../../../../core/models/mascota.model';

/**
 * Componente de formulario de cliente
 * - Maneja creación y edición
 * - FormArray obligatorio para mascotas
 * - Validaciones reactivas completas
 * - Sincronización correcta en UPDATE
 */
@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.scss']
})
export class ClienteFormComponent implements OnInit {
  clienteForm!: FormGroup;
  isEditMode = signal(false);
  clienteId = signal<number | null>(null);
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    // Verificar si es modo edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.clienteId.set(+id);
      this.loadCliente(+id);
    } else {
      // En modo creación, agregar una mascota por defecto
      this.addMascota();
    }
  }

  /**
   * Inicializar formulario reactivo
   */
  private initForm(): void {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellido: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      dni: ['', [Validators.required, Validators.pattern(/^\d{8}$/)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.pattern(/^\d{9}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      mascotas: this.fb.array([], Validators.required)
    });
  }

  /**
   * Obtener FormArray de mascotas
   */
  get mascotas(): FormArray {
    return this.clienteForm.get('mascotas') as FormArray;
  }

  /**
   * Crear FormGroup para una mascota
   */
  private createMascotaGroup(mascota?: MascotaDTO): FormGroup {
    return this.fb.group({
      id: [mascota?.id || null],
      nombre: [mascota?.nombre || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      especie: [mascota?.especie || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      raza: [mascota?.raza || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      edad: [mascota?.edad || null, [Validators.required, Validators.min(0), Validators.max(50)]]
    });
  }

  /**
   * Agregar nueva mascota al FormArray
   */
  addMascota(): void {
    this.mascotas.push(this.createMascotaGroup());
  }

  /**
   * Eliminar mascota del FormArray
   */
  removeMascota(index: number): void {
    if (this.mascotas.length > 1) {
      this.mascotas.removeAt(index);
    } else {
      this.notificationService.warning('Debe mantener al menos una mascota');
    }
  }

  /**
   * Cargar datos del cliente en modo edición
   */
  private loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe({
      next: (response: any) => {
        if (response.data) {
          const cliente = response.data;

          // Cargar datos del cliente
          this.clienteForm.patchValue({
            nombre: cliente.nombre,
            apellido: cliente.apellido,
            dni: cliente.dni,
            email: cliente.email,
            telefono: cliente.telefono,
            direccion: cliente.direccion
          });

          // Cargar mascotas
          this.mascotas.clear();
          if (cliente.mascotas && cliente.mascotas.length > 0) {
            cliente.mascotas.forEach((mascota: any) => {
              this.mascotas.push(this.createMascotaGroup({
                id: mascota.id,
                nombre: mascota.nombre,
                especie: mascota.especie,
                raza: mascota.raza,
                edad: mascota.edad
              }));
            });
          } else {
            // Si no tiene mascotas, agregar una vacía
            this.addMascota();
          }
        }
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.router.navigate(['/clientes']);
      }
    });
  }

  /**
   * Guardar cliente (crear o actualizar)
   */
  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.notificationService.warning('Por favor, complete correctamente todos los campos');
      return;
    }

    this.isSubmitting.set(true);
    const clienteDTO: ClienteDTO = this.clienteForm.value;

    const operation = this.isEditMode() && this.clienteId()
      ? this.clienteService.updateCliente(this.clienteId()!, clienteDTO)
      : this.clienteService.createCliente(clienteDTO);

    operation.subscribe({
      next: () => {
        const message = this.isEditMode()
          ? 'Cliente actualizado exitosamente'
          : 'Cliente creado exitosamente';
        this.notificationService.success(message);
        this.router.navigate(['/clientes']);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  /**
   * Cancelar y volver al listado
   */
  onCancel(): void {
    this.router.navigate(['/clientes']);
  }

  /**
   * Verificar si un campo tiene error
   */
  hasError(fieldName: string, errorType: string = 'required'): boolean {
    const field = this.clienteForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  /**
   * Verificar si un campo de mascota tiene error
   */
  hasMascotaError(index: number, fieldName: string, errorType: string = 'required'): boolean {
    const field = this.mascotas.at(index).get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  /**
   * Obtener mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.clienteForm.get(fieldName);
    if (!field?.touched) return '';

    if (field.hasError('required')) return 'Este campo es obligatorio';
    if (field.hasError('email')) return 'Email inválido';
    if (field.hasError('minlength')) return `Mínimo ${field.errors?.['minlength'].requiredLength} caracteres`;
    if (field.hasError('maxlength')) return `Máximo ${field.errors?.['maxlength'].requiredLength} caracteres`;
    if (field.hasError('pattern')) {
      if (fieldName === 'dni') return 'DNI debe tener 8 dígitos';
      if (fieldName === 'telefono') return 'Teléfono debe tener 9 dígitos';
    }
    if (field.hasError('min')) return `Valor mínimo: ${field.errors?.['min'].min}`;
    if (field.hasError('max')) return `Valor máximo: ${field.errors?.['max'].max}`;

    return 'Campo inválido';
  }

  /**
   * Obtener mensaje de error para campo de mascota
   */
  getMascotaErrorMessage(index: number, fieldName: string): string {
    const field = this.mascotas.at(index).get(fieldName);
    if (!field?.touched) return '';

    if (field.hasError('required')) return 'Obligatorio';
    if (field.hasError('minlength')) return `Mín. ${field.errors?.['minlength'].requiredLength}`;
    if (field.hasError('maxlength')) return `Máx. ${field.errors?.['maxlength'].requiredLength}`;
    if (field.hasError('min')) return `Mín: ${field.errors?.['min'].min}`;
    if (field.hasError('max')) return `Máx: ${field.errors?.['max'].max}`;

    return 'Inválido';
  }

  /**
   * Obtener título del formulario
   */
  getTitle(): string {
    return this.isEditMode() ? 'Editar Cliente' : 'Nuevo Cliente';
  }
}





