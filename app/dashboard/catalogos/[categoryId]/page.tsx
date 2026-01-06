"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/shared/Container"
import { Loading } from "@/components/shared/Loading"
import { SubcategoryCard } from "@/components/features/catalogs/SubcategoryCard"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useCatalogs } from "@/hooks/useCatalogs"
import type { Subcategory } from "@/types/catalog"
import { THEMATIC_CATEGORIES } from "@/types/catalog"

export default function CategoryPage({ params }: { params: { categoryId: string } }) {
  const router = useRouter()
  const { loadSubcategories } = useCatalogs()
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Get category name from ID
  const categoryIndex = Number.parseInt(params.categoryId.split("-")[1]) - 1
  const categoryName = THEMATIC_CATEGORIES[categoryIndex] || "Categoría"

  useEffect(() => {
    loadData()
  }, [params.categoryId])

  const loadData = async () => {
    setIsLoading(true)
    const data = await loadSubcategories(params.categoryId)
    setSubcategories(data)
    setIsLoading(false)
  }

  if (isLoading) {
    return <Loading message="Cargando subcategorías..." />
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="ghost" onClick={() => router.push("/dashboard/catalogos")} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Volver a Categorías
        </Button>

        {/* Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">{categoryName}</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Seleccione una subcategoría para gestionar documentos
          </p>
        </div>

        {/* Subcategories Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {subcategories.map((subcategory) => (
            <SubcategoryCard
              key={subcategory.id}
              subcategory={subcategory}
              onClick={() => router.push(`/dashboard/catalogos/${params.categoryId}/${subcategory.id}`)}
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
