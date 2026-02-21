"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NoticiasContainer } from "@/components/patterns/NoticiasContainer"
import { RedesSocialesContainer } from "@/components/patterns/RedesSocialesContainer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone, Newspaper, Share2 } from "lucide-react"

export default function EstrategiasComunicacionPage() {
  const [activeTab, setActiveTab] = useState("noticias")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Estrategias de Comunicación</h1>
        <p className="text-muted-foreground">
          Gestión de noticias y redes sociales para la comunicación institucional
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Noticias</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Publicaciones activas en el portal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Redes Sociales</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Plataformas activas conectadas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
            <p className="text-xs text-muted-foreground">
              Elementos de comunicación
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="noticias" className="flex items-center gap-2">
            <Newspaper className="h-4 w-4" />
            Noticias
          </TabsTrigger>
          <TabsTrigger value="redes-sociales" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Redes Sociales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="noticias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Noticias</CardTitle>
              <CardDescription>
                Crea, edita y administra las noticias publicadas en el portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <NoticiasContainer />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="redes-sociales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestión de Redes Sociales</CardTitle>
              <CardDescription>
                Administra las redes sociales institucionales conectadas al portal
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RedesSocialesContainer />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}