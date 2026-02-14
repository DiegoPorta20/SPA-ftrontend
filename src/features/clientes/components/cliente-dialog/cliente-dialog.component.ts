import { Component, Inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { ClienteService } from '../../services/cliente.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { ClienteDTO } from '../../../../core/models/cliente.model';
import { MascotaDTO } from '../../../../core/models/mascota.model';

export interface ClienteDialogData {
  clienteId?: number;
  isEdit: boolean;
}

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatCardModule
  ],
  templateUrl: './cliente-dialog.component.html',
  styleUrls: ['./cliente-dialog.component.scss']
})
export class ClienteDialogComponent implements OnInit {
  clienteForm!: FormGroup;
  isSubmitting = signal(false);

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService,
    private notificationService: NotificationService,
    public dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteDialogData
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    if (this.data.isEdit && this.data.clienteId) {
      this.loadCliente(this.data.clienteId);
    } else {
      this.addMascota();
    }
  }

  private initForm(): void {
    this.clienteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      apellidos: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      dni: ['', [Validators.required, Validators.pattern(/^[0-9]{8}[A-Z]?$/i)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[+]?[\d\s-]{9,20}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(255)]],
      mascotas: this.fb.array([], Validators.required)
    });
  }

  get mascotas(): FormArray {
    return this.clienteForm.get('mascotas') as FormArray;
  }

  private createMascotaGroup(mascota?: MascotaDTO): FormGroup {
    return this.fb.group({
      id: [mascota?.id || null],
      nombre: [mascota?.nombre || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      especie: [mascota?.especie || '', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      raza: [mascota?.raza || '', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      edad: [mascota?.edad || null, [Validators.required, Validators.min(0), Validators.max(50)]]
    });
  }

  addMascota(): void {
    this.mascotas.push(this.createMascotaGroup());
  }

  removeMascota(index: number): void {
    if (this.mascotas.length > 1) {
      this.mascotas.removeAt(index);
    } else {
      this.notificationService.warning('Debe mantener al menos una mascota');
    }
  }

  private loadCliente(id: number): void {
    this.clienteService.getCliente(id).subscribe({
      next: (response: any) => {
        // El API puede devolver data directamente o en response.data
        const cliente = response.data || response;

        if (cliente && cliente.id) {
          this.clienteForm.patchValue({
            nombres: cliente.nombres,
            apellidos: cliente.apellidos,
            dni: cliente.dni,
            email: cliente.email,
            telefono: cliente.telefono,
            direccion: cliente.direccion
          });

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
            this.addMascota();
          }
        } else {
          this.notificationService.error('No se pudo cargar el cliente');
          this.dialogRef.close();
        }
      },
      error: () => {
        this.notificationService.error('Error al cargar el cliente');
        this.dialogRef.close();
      }
    });
  }

  onSubmit(): void {
    if (this.clienteForm.invalid) {
      this.clienteForm.markAllAsTouched();
      this.notificationService.warning('Por favor, complete correctamente todos los campos');
      return;
    }

    this.isSubmitting.set(true);
    const clienteDTO: ClienteDTO = this.clienteForm.value;

    const operation = this.data.isEdit && this.data.clienteId
      ? this.clienteService.updateCliente(this.data.clienteId, clienteDTO)
      : this.clienteService.createCliente(clienteDTO);

    operation.subscribe({
      next: () => {
        const message = this.data.isEdit
          ? 'Cliente actualizado exitosamente'
          : 'Cliente creado exitosamente';
        this.notificationService.success(message);
        this.dialogRef.close(true);
      },
      error: () => {
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  get getTitle(): string {
    return this.data.isEdit ? 'Editar Cliente' : 'Nuevo Cliente';
  }

  get getTitleIcon(): string {
    return this.data.isEdit ? 'edit' : 'person_add';
  }
}

