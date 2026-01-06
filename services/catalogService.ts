import type { Category, Subcategory, Document } from "@/types/catalog"
import { THEMATIC_CATEGORIES } from "@/types/catalog"

export const catalogService = {
  async getCategories(): Promise<Category[]> {
    // Mock implementation - replace with actual API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock data for the 7 thematic categories
    return THEMATIC_CATEGORIES.map((nombre, index) => ({
      id: `cat-${index + 1}`,
      nombre,
      descripcion: `Documentación relacionada con ${nombre.toLowerCase()}`,
      subcategorias: [],
    }))
  },

  async getSubcategories(categoryId: string): Promise<Subcategory[]> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mock subcategories
    return [
      {
        id: `sub-${categoryId}-1`,
        nombre: "Documentos Generales",
        descripcion: "Información general y documentos base",
        documentos: [],
      },
      {
        id: `sub-${categoryId}-2`,
        nombre: "Informes Trimestrales",
        descripcion: "Reportes trimestrales",
        documentos: [],
      },
      {
        id: `sub-${categoryId}-3`,
        nombre: "Informes Anuales",
        descripcion: "Reportes anuales consolidados",
        documentos: [],
      },
    ]
  },

  async getDocuments(subcategoryId: string): Promise<Document[]> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))

    return []
  },

  async uploadDocument(document: Omit<Document, "id" | "uploadedAt">): Promise<Document> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return {
      ...document,
      id: `doc-${Date.now()}`,
      uploadedAt: new Date().toISOString(),
    }
  },

  async deleteDocument(documentId: string): Promise<void> {
    // Mock implementation
    await new Promise((resolve) => setTimeout(resolve, 500))
  },
}
