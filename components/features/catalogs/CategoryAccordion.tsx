"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Category } from "@/types/catalog"
import { SubcategoryAccordion } from "./SubcategoryAccordion"

interface CategoryAccordionProps {
  category: Category
  index: number
  canUpload: boolean
}

export function CategoryAccordion({ category, index, canUpload }: CategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="overflow-hidden rounded-lg border bg-card">
      {/* Category Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left transition-colors hover:bg-muted/50"
      >
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
            {index}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{category.nombre}</h3>
            <p className="text-sm text-muted-foreground">
              {category.subcategorias.length} subcategoría{category.subcategorias.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn("h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-180")}
        />
      </button>

      {/* Subcategories */}
      {isOpen && (
        <div className="border-t bg-muted/20 p-4">
          <div className="space-y-3">
            {category.subcategorias.map((subcategory) => (
              <SubcategoryAccordion
                key={subcategory.id}
                subcategory={subcategory}
                categoryId={category.id}
                canUpload={canUpload}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
