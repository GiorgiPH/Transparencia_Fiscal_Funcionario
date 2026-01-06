import { LoginForm } from "@/components/features/auth/LoginForm"
import { Shield } from "lucide-react"
import { APP_NAME, APP_SUBTITLE } from "@/lib/constants"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-muted px-4 py-12">
      <div className="w-full max-w-md space-y-8">
        {/* Institutional Header */}
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-balance text-3xl font-bold tracking-tight text-primary">{APP_NAME}</h1>
          <p className="mt-2 text-sm font-medium text-accent">{APP_SUBTITLE}</p>
          <p className="mt-4 text-pretty text-sm text-muted-foreground">Sistema de Gestión de Transparencia Fiscal</p>
        </div>

        {/* Login Card */}
        <div className="rounded-lg border bg-card p-8 shadow-lg">
          <div className="mb-6">
            <h2 className="text-center text-xl font-semibold text-card-foreground">Acceso al Sistema</h2>
            <p className="mt-2 text-center text-sm text-muted-foreground">Ingrese sus credenciales institucionales</p>
          </div>

          <LoginForm />
        </div>

        {/* Footer Info */}
        <div className="text-center text-xs text-muted-foreground">
          <p>Gobierno del Estado de Morelos</p>
          <p className="mt-1">Secretaría de Administración y Finanzas</p>
        </div>
      </div>
    </div>
  )
}
