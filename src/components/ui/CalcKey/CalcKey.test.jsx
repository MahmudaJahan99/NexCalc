// src/components/ui/CalcKey/CalcKey.test.jsx
//
// ── Learning Note — Testing Presentational Components ──────────────────────
// CalcKey is dumb — it just renders and fires onClick.
// Its tests focus on:
//   1. Does it render the label?
//   2. Does it fire onClick when clicked?
//   3. Does it NOT fire onClick when disabled?
//   4. Does it apply the right aria attributes?
//
// We don't test Framer Motion internals — we trust the library works.
// We test OUR code: props in → correct DOM out → interactions work.
// ─────────────────────────────────────────────────────────────────────────

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import CalcKey from './CalcKey'

describe('CalcKey', () => {

  it('renders the label', () => {
    render(<CalcKey label="7" onClick={() => {}} />)
    expect(screen.getByText('7')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn()   // vi.fn() creates a mock/spy function
    render(<CalcKey label="+" onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does NOT call onClick when disabled', () => {
    const handleClick = vi.fn()
    render(<CalcKey label="7" onClick={handleClick} disabled />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('sets aria-label to the label prop', () => {
    render(<CalcKey label="sin" onClick={() => {}} />)
    expect(screen.getByRole('button', { name: 'sin' })).toBeInTheDocument()
  })

  it('renders an accent dot for function variant', () => {
    const { container } = render(
      <CalcKey label="sin" variant="function" onClick={() => {}} />
    )
    // The accentDot span has aria-hidden="true", query by that
    const dot = container.querySelector('[aria-hidden="true"]')
    expect(dot).toBeInTheDocument()
  })

  it('does NOT render accent dot for non-function variants', () => {
    const { container } = render(
      <CalcKey label="7" variant="number" onClick={() => {}} />
    )
    const dot = container.querySelector('[aria-hidden="true"]')
    expect(dot).not.toBeInTheDocument()
  })

  it('sets data-key-id attribute when keyId is provided', () => {
    render(<CalcKey label="7" keyId="seven" onClick={() => {}} />)
    expect(screen.getByRole('button')).toHaveAttribute('data-key-id', 'seven')
  })

})