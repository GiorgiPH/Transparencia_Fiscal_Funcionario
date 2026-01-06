"use client"

import { useState } from "react"
import { ChevronRight, Upload, FileText, Download } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Subcategory } from "@/types/catalog"
import { Button } from "@/components/ui/button"
import { DocumentUploadModal } from "./DocumentUploadModal"

interface SubcategoryAccordionProps {
  subcategory: Subcategory
  categoryId: string
  canUpload: boolean
}

// Mock document types that can be uploaded for each subcategory
const DOCUMENT_TYPES = [
  "Documento que contiene el plan estatal de desarrollo",
  "Objetivos del Plan Estatal de Desarrollo",
  "Desglose de acciones y responsables de ejecutarlas",
  "Indicadores asociados a los objetivos",
  "Líneas base de indicadores",
  "Metas Intermedias y de fin de período de los indicadores",
]

export function SubcategoryAccordion({ subcategory, categoryId, canUpload }: SubcategoryAccordionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [selectedDocType, setSelectedDocType] = useState<string>("")

  const handleUpload = async (data: any) => {
    // Mock upload - in real app, call API
    console.log("[v0] Uploading document:", data, "for type:", selectedDocType)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const handleOpenUpload = (docType: string) => {
    setSelectedDocType(docType)
    setShowUploadModal(true)
  }

  return (
    <>
      <div className="overflow-hidden rounded-lg border bg-card">
        {/* Subcategory Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted/50"
        >
          <ChevronRight
            className={cn("h-4 w-4 flex-shrink-0 text-muted-foreground transition-transform", isOpen && "rotate-90")}
          />
          <span className="flex-1 text-sm font-medium text-foreground">{subcategory.nombre}</span>
        </button>

        {/* Document Types List */}
        {isOpen && (
          <div className="border-t bg-background p-4">
            <div className="space-y-2">
              {DOCUMENT_TYPES.map((docType, idx) => {
                // Check if document already exists (mock check)
                const existingDoc = subcategory.documentos.find((doc) => doc.nombre === docType)

                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 rounded-lg border bg-card p-3 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span className="text-sm text-foreground">{docType}</span>
                    </div>

                    {existingDoc ? (
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Download className="h-4 w-4" />
                        Descargar
                      </Button>
                    ) : canUpload ? (
                      <Button variant="ghost" size="sm" className="gap-2" onClick={() => handleOpenUpload(docType)}>
                        <Upload className="h-4 w-4" />
                        Cargar
                      </Button>
                    ) : null}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>

      <DocumentUploadModal
        open={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUpload}
        subcategoryName={`${subcategory.nombre} - ${selectedDocType}`}
      />
    </>
  )
}
