"use client"

import { Container } from "@/components/shared/Container"
import { Loading } from "@/components/shared/Loading"
import { CategoryAccordion } from "@/components/features/catalogs/CategoryAccordion"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useCatalogs } from "@/hooks/useCatalogs"
import { useAuth } from "@/hooks/useAuth"

export default function CatalogosPage() {
  const { user } = useAuth()
  const { rootCatalogs, isLoading } = useCatalogs()

  const canUpload = user?.rol === "Admin" || user?.rol === "Upload"

  if (isLoading) {
    return <Loading message="Cargando categorías..." />
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Catálogos</h1>
          <p className="mt-2 text-pretty text-muted-foreground">Modelo Temático de Transparencia Fiscal (MTTF)</p>
        </div>

        {/* Search */}
        <div className="rounded-lg border bg-card p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder="Buscar categorías, subcategorías o documentos..." className="pl-10" />
          </div>
        </div>

        {/* Categories Accordion */}
        <div className="space-y-4">
          {rootCatalogs.map((category, index) => (
            <CategoryAccordion key={category.id} category={category} index={index + 1} canUpload={canUpload} />
          ))}
        </div>
      </div>
    </Container>
  )
}
