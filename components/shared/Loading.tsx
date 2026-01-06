import { Spinner } from "@/components/ui/spinner"

interface LoadingProps {
  message?: string
}

export function Loading({ message = "Cargando..." }: LoadingProps) {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center gap-4">
      <Spinner className="h-8 w-8" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  )
}
