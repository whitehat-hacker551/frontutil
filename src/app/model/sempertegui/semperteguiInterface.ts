// Define la estructura de los datos de una película.
export interface IPelicula {
  id: number;
  nombre: string;
  genero: string;
  director: string;
  puntuacion: number; // Puntuación del 1 al 10
  anyo: number;
  fechaCreacion: string;
  fechaModificacion: any;
}