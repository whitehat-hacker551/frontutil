import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CalinescuService } from '../../../service/calinescu.service';
import { ICalinescu } from '../../../model/calinescu';
import { HttpErrorResponse } from '@angular/common/http';

/**
 * Componente para editar un item existente de la lista de compras (vista admin).
 * 
 * Proporciona un formulario reactivo para modificar los datos de un item,
 * incluyendo:
 * - Carga del item existente desde el servidor
 * - Validación de campos
 * - Conversión de formatos de fecha
 * - Actualización en el backend
 */
@Component({
    selector: 'app-routed-admin-edit-calinescu',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './routed-admin-edit.html',
    styleUrl: './routed-admin-edit.css',
})
export class RoutedAdminEditCalinescu implements OnInit {
    private fb = inject(FormBuilder);
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    private calinescuService = inject(CalinescuService);

    /** Formulario reactivo para editar el item */
    calinescuForm!: FormGroup;
    
    /** ID del item que se está editando */
    itemId: number | null = null;
    
    /** Indica si se está cargando el item desde el servidor */
    loading: boolean = true;
    
    /** Mensaje de error si falla la carga o actualización */
    error: string | null = null;
    
    /** Indica si se está enviando el formulario */
    submitting: boolean = false;
    
    /** Copia del item original cargado desde el servidor */
    private originalItem: ICalinescu | null = null;

    ngOnInit(): void {
        this.inicializarFormulario();
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.itemId = +id;
            this.cargarItem(+id);
        } else {
            this.loading = false;
            this.error = 'ID de item no válido';
        }
    }

    /**
     * Inicializa el formulario reactivo con los campos y validaciones.
     */
    inicializarFormulario(): void {
        this.calinescuForm = this.fb.group({
            nombre: ['', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(255)]],
            contenido: ['', [
                Validators.required,
                Validators.minLength(3)]],
            fechaCompraEsperada: [''],
            publicado: [true],
            precio: [0, [Validators.min(0)]],
            cantidad: [1, [Validators.required, Validators.min(1)]],
        });
    }

    /**
     * Carga los datos del item desde el servidor y los establece en el formulario.
     * Convierte el formato de fecha del backend al formato del input datetime-local.
     * 
     * @param id - ID del item a cargar
     */
    cargarItem(id: number): void {
        this.calinescuService.get(id).subscribe({
            next: (item: ICalinescu) => {
                this.originalItem = item;
                
                // Convertir fecha del backend (yyyy-MM-dd HH:mm:ss) a formato datetime-local (yyyy-MM-ddTHH:mm)
                let fechaParaInput = '';
                if (item.fecha_compra_esperada) {
                    fechaParaInput = this.convertirFechaParaInput(item.fecha_compra_esperada);
                }
                
                this.calinescuForm.patchValue({
                    nombre: item.nombre,
                    contenido: item.contenido,
                    fechaCompraEsperada: fechaParaInput,
                    publicado: item.publicado,
                    precio: item.precio || 0,
                    cantidad: item.cantidad || 1,
                });
                this.loading = false;
            },
            error: (err: HttpErrorResponse) => {
                this.error = 'Error al cargar el item';
                this.loading = false;
                console.error(err);
            },
        });
    }

    /**
     * Convierte una fecha del formato del backend al formato requerido por input datetime-local.
     * 
     * @param fechaBackend - Fecha en formato "yyyy-MM-dd HH:mm:ss"
     * @returns Fecha en formato "yyyy-MM-ddTHH:mm"
     */
    convertirFechaParaInput(fechaBackend: string): string {
        // Convierte "2025-11-26 20:30:00" a "2025-11-26T20:30"
        return fechaBackend.replace(' ', 'T').substring(0, 16);
    }

    /**
     * Procesa y envía el formulario de edición al servidor.
     * Valida los datos, formatea la fecha y actualiza el item.
     */
    enviarFormulario(): void {
        if (!this.calinescuForm.valid || !this.itemId) {
            this.calinescuForm.markAllAsTouched();
            return;
        }

        this.submitting = true;
        
        // Convertir fecha si existe
        let fechaFormateada: string | undefined = undefined;
        if (this.calinescuForm.value.fechaCompraEsperada) {
            const fecha = new Date(this.calinescuForm.value.fechaCompraEsperada);
            fechaFormateada = this.formatearFecha(fecha);
        }
        
        const payload: Partial<ICalinescu> = {
            id: this.itemId!,
            nombre: this.calinescuForm.value.nombre,
            contenido: this.calinescuForm.value.contenido,
            fecha_compra_esperada: fechaFormateada,
            publicado: this.calinescuForm.value.publicado,
            precio: this.calinescuForm.value.precio || 0,
            cantidad: this.calinescuForm.value.cantidad || 1,
        };

        this.calinescuService.update(payload).subscribe({
            next: () => {
                this.submitting = false;
                this.router.navigate(['/calinescu/plist']);
            },
            error: (err: HttpErrorResponse) => {
                this.submitting = false;
                this.error = 'Error al guardar el item';
                console.error(err);
            },
        });
    }

    /**
     * Formatea un objeto Date al formato esperado por el backend.
     * 
     * @param fecha - Objeto Date a formatear
     * @returns Fecha en formato "yyyy-MM-dd HH:mm:ss"
     */
    formatearFecha(fecha: Date): string {
        const year = fecha.getFullYear();
        const month = String(fecha.getMonth() + 1).padStart(2, '0');
        const day = String(fecha.getDate()).padStart(2, '0');
        const hours = String(fecha.getHours()).padStart(2, '0');
        const minutes = String(fecha.getMinutes()).padStart(2, '0');
        const seconds = String(fecha.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    /** Getter para acceder al control 'nombre' del formulario */
    get nombre() {
        return this.calinescuForm.get('nombre');
    }

    /** Getter para acceder al control 'contenido' del formulario */
    get contenido() {
        return this.calinescuForm.get('contenido');
    }

    /** Getter para acceder al control 'fechaCompraEsperada' del formulario */
    get fechaCompraEsperada() {
        return this.calinescuForm.get('fechaCompraEsperada');
    }

    /** Getter para acceder al control 'publicado' del formulario */
    get publicado() {
        return this.calinescuForm.get('publicado');
    }

    get precio() {
        return this.calinescuForm.get('precio');
    }

    get cantidad() {
        return this.calinescuForm.get('cantidad');
    }
}
