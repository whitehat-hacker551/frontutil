import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { serverURL } from '../environment/environment';
import { IPage } from '../model/plist';
import { ICalinescu } from '../model/calinescu';
import { Observable } from 'rxjs';

/**
 * Servicio para gestionar las operaciones CRUD de la lista de compras de Calinescu.
 * 
 * Este servicio proporciona métodos para interactuar con la API backend y realizar
 * operaciones de creación, lectura, actualización y eliminación (CRUD) de items
 * en la lista de compras, así como funcionalidades adicionales como paginación
 * y generación de datos de prueba.
 */
@Injectable({
  providedIn: 'root',
})
export class CalinescuService {

  constructor(private oHttp: HttpClient) { }

  /**
   * Obtiene una página de items de la lista de compras con opciones de ordenamiento.
   * 
   * @param page - Número de página a obtener (base 0)
   * @param rpp - Registros por página (rows per page)
   * @param order - Campo por el cual ordenar (por defecto 'id')
   * @param direction - Dirección del ordenamiento: 'asc' o 'desc' (por defecto 'asc')
   * @param soloPublicados - Si es true, solo devuelve items publicados (para vistas de usuario)
   * @returns Observable con la página de items solicitada
   */
  getPage(page: number, rpp: number, order: string = '', direction: string = '', soloPublicados: boolean = false): Observable<IPage<ICalinescu>> {
    if (order === '') {
      order = 'id';
    }
    if (direction === '') {
      direction = 'asc';
    }
    const publicadoParam = soloPublicados ? '&publicado=true' : '';
    return this.oHttp.get<IPage<ICalinescu>>(serverURL + `/calinescuListaCompra?page=${page}&size=${rpp}&sort=${order},${direction}${publicadoParam}`);
  }

  /**
   * Obtiene un item específico de la lista de compras por su ID.
   * 
   * @param id - Identificador único del item a obtener
   * @returns Observable con el item solicitado
   */
  get(id: number): Observable<ICalinescu> {
    return this.oHttp.get<ICalinescu>(serverURL + '/calinescuListaCompra/' + id);
  }

  /**
   * Crea un nuevo item en la lista de compras.
   * 
   * @param calinescu - Datos del nuevo item a crear (parciales, sin ID)
   * @returns Observable con el ID del item creado
   */
  create(calinescu: Partial<ICalinescu>): Observable<number> {
    return this.oHttp.post<number>(serverURL + '/calinescuListaCompra', calinescu);
  }

  /**
   * Actualiza un item existente en la lista de compras.
   * 
   * @param calinescu - Datos del item a actualizar (debe incluir el ID)
   * @returns Observable con el ID del item actualizado
   */
  update(calinescu: Partial<ICalinescu>): Observable<number> {
    return this.oHttp.put<number>(serverURL + '/calinescuListaCompra', calinescu);
  }

  /**
   * Elimina un item de la lista de compras.
   * 
   * @param id - Identificador único del item a eliminar
   * @returns Observable con el ID del item eliminado
   */
  delete(id: number): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/calinescuListaCompra/' + id);
  }

  /**
   * Genera datos de prueba (fake data) para la lista de compras.
   * 
   * Este método es útil para poblar la base de datos con items de ejemplo
   * durante el desarrollo y pruebas.
   * 
   * @param numItems - Cantidad de items falsos a generar
   * @returns Observable con el número de items generados
   */
  rellenaListaCompra(numItems: number): Observable<number> {
    return this.oHttp.get<number>(serverURL + '/calinescuListaCompra/rellena/' + numItems);
  }

  getTotalPrecios(soloPublicados: boolean = false): Observable<number> {
    const publicadoParam = soloPublicados ? '?publicado=true' : '';
    return this.oHttp.get<number>(serverURL + '/calinescuListaCompra/total' + publicadoParam);
  }

  deleteAll(): Observable<number> {
    return this.oHttp.delete<number>(serverURL + '/calinescuListaCompra/all');
  }

}
