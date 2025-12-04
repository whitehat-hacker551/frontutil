export interface IFernandezIdea {
  id: number
  titulo: string
  comentario: string
  categoria: 'IDEA' | 'MEJORA' | 'BUG'
  publico: boolean
  fechaCreacion: string
  fechaModificacion: string
}
