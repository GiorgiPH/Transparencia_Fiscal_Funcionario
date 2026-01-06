export type DocumentType = "Excel" | "PDF" | "Word" | "CSV" | "JSON" | "XML"
export type Periodicity = "Anual" | "Mensual" | "Semestral" | "Trimestral"

export interface Document {
  id: string
  nombre: string
  tipo: DocumentType
  periodicidad: Periodicity
  categoria: string
  subcategoria: string
  archivo?: File
  url?: string
  uploadedBy: string
  uploadedAt: string
}

export interface Subcategory {
  id: string
  nombre: string
  descripcion: string
  documentos: Document[]
}

export interface Category {
  id: string
  nombre: string
  descripcion: string
  subcategorias: Subcategory[]
}

export const THEMATIC_CATEGORIES: string[] = [
  "Plan Estatal de Desarrollo",
  "Ingresos",
  "Deuda Pública",
  "Presupuesto de Egresos",
  "Información Contable",
  "Rendición de Cuentas",
  "Marco Normativo",
]
