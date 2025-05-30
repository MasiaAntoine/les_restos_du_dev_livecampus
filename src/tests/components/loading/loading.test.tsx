import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Loading from '@/components/loading/loading'

describe('Loading', () => {
  it("affiche le composant de chargement avec l'icône et le texte", () => {
    render(<Loading />)

    // Vérifier que le composant de chargement est présent
    const loadingComponent = screen.getByTestId('loading-component')
    expect(loadingComponent).toBeInTheDocument()

    // Vérifier que l'icône de chargement est présente
    const loadingIcon = screen.getByTestId('loading-icon')
    expect(loadingIcon).toBeInTheDocument()
    expect(loadingIcon).toHaveClass('animate-spin')
    expect(loadingIcon).toHaveClass('h-8')
    expect(loadingIcon).toHaveClass('w-8')
    expect(loadingIcon).toHaveClass('text-primary')

    // Vérifier que le texte de chargement est présent
    const loadingText = screen.getByText('Chargement...')
    expect(loadingText).toBeInTheDocument()
  })

  it('affiche le composant de chargement avec les bonnes classes CSS', () => {
    render(<Loading />)

    const loadingComponent = screen.getByTestId('loading-component')

    // Vérifier les classes du conteneur principal
    expect(loadingComponent).toHaveClass('h-screen')
    expect(loadingComponent).toHaveClass('w-screen')
    expect(loadingComponent).toHaveClass('flex')
    expect(loadingComponent).toHaveClass('items-center')
    expect(loadingComponent).toHaveClass('justify-center')

    // Vérifier les classes du conteneur interne
    const innerContainer = loadingComponent.firstChild
    expect(innerContainer).toHaveClass('flex')
    expect(innerContainer).toHaveClass('flex-col')
    expect(innerContainer).toHaveClass('items-center')
    expect(innerContainer).toHaveClass('gap-2')
  })
})
