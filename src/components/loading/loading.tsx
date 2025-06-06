import { Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
      data-testid="loading-component"
    >
      <div className="flex flex-col items-center gap-2">
        <Loader2
          className="h-8 w-8 animate-spin text-primary"
          data-testid="loading-icon"
        />
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    </div>
  )
}
