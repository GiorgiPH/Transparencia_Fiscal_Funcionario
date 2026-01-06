"use client"

import { useState, useEffect } from "react"
import { catalogService } from "@/services/catalogService"
import type { Category, Subcategory, Document } from "@/types/catalog"

export function useCatalogs() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setIsLoading(true)
      const data = await catalogService.getCategories()
      setCategories(data)
    } catch (err) {
      setError("Error al cargar categorías")
    } finally {
      setIsLoading(false)
    }
  }

  const loadSubcategories = async (categoryId: string): Promise<Subcategory[]> => {
    try {
      return await catalogService.getSubcategories(categoryId)
    } catch (err) {
      setError("Error al cargar subcategorías")
      return []
    }
  }

  const loadDocuments = async (subcategoryId: string): Promise<Document[]> => {
    try {
      return await catalogService.getDocuments(subcategoryId)
    } catch (err) {
      setError("Error al cargar documentos")
      return []
    }
  }

  const uploadDocument = async (document: Omit<Document, "id" | "uploadedAt">): Promise<Document> => {
    try {
      return await catalogService.uploadDocument(document)
    } catch (err) {
      setError("Error al subir documento")
      throw err
    }
  }

  return {
    categories,
    isLoading,
    error,
    loadSubcategories,
    loadDocuments,
    uploadDocument,
  }
}
