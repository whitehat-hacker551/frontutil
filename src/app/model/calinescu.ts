/**
 * Interfaz que representa un elemento de la lista de compras de Calinescu.
 * 
 * Esta interfaz define la estructura de datos para los items que el sistema
 * gestiona en la lista de compras, incluyendo información sobre el producto,
 * fechas relevantes y estado de publicación.
 */
export interface ICalinescu {
  /** Identificador único del item en la lista de compras */
  id: number
  
  /** Nombre del producto o artículo a comprar */
  nombre: string
  
  /** Descripción detallada o contenido adicional del item */
  contenido: string
  
  /** Fecha esperada para realizar la compra (formato: yyyy-MM-dd HH:mm:ss) */
  fecha_compra_esperada: string
  
  /** Fecha de creación del registro en el sistema */
  fecha_creacion: string
  
  /** Fecha de la última modificación del registro */
  fecha_modificacion: any
  
  /** Indica si el item está publicado y visible para los usuarios */
  publicado: boolean
  
  /** Precio estimado del producto */
  precio: number
  
  /** Cantidad de unidades a comprar */
  cantidad: number
}
