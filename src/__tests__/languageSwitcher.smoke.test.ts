import { beforeEach, describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/dom'
import { mountLanguageSwitcher } from '@/shared/ui/languageSwitcher'

/**
 * Smoke test: prova que a infra de teste (Vitest + jsdom + Testing Library)
 * funciona ponta a ponta neste projeto vanilla TS, montando um componente
 * real no DOM e checando o resultado renderizado.
 */
describe('mountLanguageSwitcher (smoke test)', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
    localStorage.clear()
  })

  it('renders a language selector into the container without throwing', () => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    expect(() => mountLanguageSwitcher(container)).not.toThrow()

    const select = within(container).getByRole('combobox')
    expect(select).toBeInTheDocument()
    expect(select.tagName).toBe('SELECT')
    expect(select).toHaveAttribute('id', 'language-select')

    const options = screen.getAllByRole('option') as HTMLOptionElement[]
    const values = options.map((option) => option.value)
    expect(values).toEqual(['pt-BR', 'en-US'])
  })
})
