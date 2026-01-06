"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import type { Category } from "@/types/catalog"

interface CategoryCardProps {
  category: Category
  onClick: () => void
}

export function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={onClick}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <span>{category.nombre}</span>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{category.descripcion}</CardDescription>
      </CardContent>
    </Card>
  )
}
