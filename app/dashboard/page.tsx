import { Container } from "@/components/shared/Container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Scale, FileText, Target } from "lucide-react"

export default function DashboardPage() {
  return (
    <Container>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-foreground">Inicio</h1>
          <p className="mt-2 text-pretty text-muted-foreground">
            Bienvenido al Portal de Transparencia Fiscal del Estado de Morelos
          </p>
        </div>

        {/* Legal Framework Banner */}
        <Card className="border-l-4 border-l-primary bg-muted/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Scale className="h-6 w-6 text-primary" />
              </div>
              <span>Marco Legal de Transparencia Fiscal</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
              De acuerdo a la normatividad presentada en las Leyes Federales (CPEUM: Art. 6 y Art. 134, Ley General de
              Transparencia y Acceso a la Información Pública, Ley General de Contabilidad Gubernamental, Ley de
              Disciplina Financiera de las Entidades Federativas y los Municipios, Ley Federal de Presupuesto y
              Responsabilidad Hacendaria) y Locales (Ley de Transparencia y Acceso a la Información Pública del Estado
              de Morelos, Ley de Presupuesto, Contabilidad y Gasto Público del Estado de Morelos), la transparencia
              fiscal es una obligación.
            </p>
          </CardContent>
        </Card>

        {/* Three Pillars */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="transition-colors hover:border-primary">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <CardTitle className="text-lg">Objetivo</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pretty text-sm text-muted-foreground">
                Facilitar la carga y gestión de documentos del Modelo Temático de Transparencia Fiscal (MTTF)
              </p>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-secondary">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-secondary/10">
                <Scale className="h-6 w-6 text-secondary" />
              </div>
              <CardTitle className="text-lg">Modelo MHECS</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pretty text-sm text-muted-foreground">
                Implementación del Modelo Hacendario Estatal para la Cohesión Social de la Unión Europea
              </p>
            </CardContent>
          </Card>

          <Card className="transition-colors hover:border-accent">
            <CardHeader>
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <CardTitle className="text-lg">Compromiso</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-pretty text-sm text-muted-foreground">
                Garantizar el acceso ciudadano a la información fiscal del Estado de Morelos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>Instrucciones de Uso</CardTitle>
            <CardDescription>Siga estos pasos para utilizar el sistema de manera efectiva</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Navega a la sección <span className="font-semibold">CATÁLOGOS</span> para acceder a las categorías
                    temáticas
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Selecciona la categoría y subcategoría correspondiente al documento que deseas cargar
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Haz clic en el documento específico y completa la información requerida (tipo y periodicidad)
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  4
                </div>
                <div className="flex-1">
                  <p className="text-sm text-foreground">
                    Configura tu perfil en <span className="font-semibold">CONFIGURACIÓN</span> para personalizar tu
                    experiencia
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  )
}
