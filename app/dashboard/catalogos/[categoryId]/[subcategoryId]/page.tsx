"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Container } from "@/components/shared/Container"
import { Loading } from "@/components/shared/Loading"
import { DocumentUploadModal } from "@/components/features/catalogs/DocumentUploadModal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, Upload, FileIcon, Calendar, User } from "lucide-react"
import { useCatalogs } from "@/hooks/useCatalogs"
import { useAuth } from "@/hooks/useAuth"
import type { Document } from "@/types/catalog"

export default function SubcategoryPage({ params }: { params: { categoryId: string; subcategoryId: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const { loadDocuments, uploadDocument } = useCatalogs()
  const [documents, setDocuments] = useState<Document[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  const subcategoryName = "Documentos Generales" // Mock - would come from API

  useEffect(() => {
    loadData()
  }, [params.subcategoryId])

  const loadData = async () => {
    setIsLoading(true)
    const data = await loadDocuments(params.subcategoryId)
    setDocuments(data)
    setIsLoading(false)
  }

  const handleUpload = async (data: { tipo: any; periodicidad: any; archivo: File }) => {
    const newDoc = await uploadDocument({
      nombre: data.archivo.name,
      tipo: data.tipo,
      periodicidad: data.periodicidad,
      categoria: params.categoryId,
      subcategoria: params.subcategoryId,
      uploadedBy: user?.nombre || "Unknown",
    })
    setDocuments([...documents, newDoc])
  }

  const canUpload = user?.rol === "Admin" || user?.rol === "Upload"

  if (isLoading) {
    return <Loading message="Cargando documentos..." />
  }

  return (
    <Container>
      <div className="space-y-6">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => router.push(`/dashboard/catalogos/${params.categoryId}`)}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Volver a Subcategorías
        </Button>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">{subcategoryName}</h1>
            <p className="mt-2 text-pretty text-muted-foreground">Gestión de documentos</p>
          </div>
          {canUpload && (
            <Button onClick={() => setUploadModalOpen(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Subir Documento
            </Button>
          )}
        </div>

        {/* Documents List */}
        {documents.length > 0 ? (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card key={doc.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileIcon className="h-5 w-5 text-primary" />
                    {doc.nombre}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="font-medium">Tipo:</span>
                    <span>{doc.tipo}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    <span>{doc.periodicidad}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <User className="h-4 w-4" />
                    <span>{doc.uploadedBy}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileIcon className="mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">No hay documentos cargados</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {canUpload ? "Haga clic en 'Subir Documento' para comenzar" : "No se han cargado documentos aún"}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Upload Modal */}
        <DocumentUploadModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUpload={handleUpload}
          subcategoryName={subcategoryName}
        />
      </div>
    </Container>
  )
}
