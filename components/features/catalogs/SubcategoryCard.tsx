"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, FileText } from "lucide-react"
import type { Subcategory } from "@/types/catalog"

interface SubcategoryCardProps {
  subcategory: Subcategory
  onClick: () => void
}

export function SubcategoryCard({ subcategory, onClick }: SubcategoryCardProps) {
  return (
    <Card className="cursor-pointer transition-all hover:border-primary hover:shadow-md" onClick={onClick}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            <span>{subcategory.nombre}</span>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm">{subcategory.descripcion}</CardDescription>
      </CardContent>
    </Card>
  )
}
