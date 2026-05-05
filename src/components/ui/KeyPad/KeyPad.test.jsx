// src/components/ui/KeyPad/KeyPad.test.jsx
//
// Integration test for KeyPad. Unlike CalcKey's unit test, this one
// renders KeyPad inside a real CalculatorProvider and verifies that
// pressing keys actually updates the display.
//
// ── Learning Note — Integration vs Unit tests ──────────────────────────────
// Unit test: CalcKey in isolation — fast, narrow, tests ONE thing
// Integration test: KeyPad + Provider + Reducer + mathEngine working together
//   → slower, wider, confirms the whole chain works
// Both matter. Units find WHERE the bug is; integration confirms NOTHING IS BROKEN.
// ─────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { CalculatorProvider } from '@/context/CalculatorContext'
import KeyPad from './KeyPad'
import DisplayPanel from '@/components/ui/DisplayPanel'

function renderCalculator() {
  return render(
    <CalculatorProvider>
      <DisplayPanel />
      <KeyPad />
    </CalculatorProvider>
  )
}

describe('KeyPad', () => {

  it('renders all calculator keys', () => {
    renderCalculator()
    // Spot-check a few key labels are present
    expect(screen.getByRole('button', { name: '7' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'sin' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '=' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'AC' })).toBeInTheDocument()
  })

  it('pressing number keys updates the display', async () => {
    renderCalculator()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '4' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
    })
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('pressing = evaluates the expression', async () => {
    renderCalculator()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '6' }))
      fireEvent.click(screen.getByRole('button', { name: '×' }))
      fireEvent.click(screen.getByRole('button', { name: '7' }))
      fireEvent.click(screen.getByRole('button', { name: '=' }))
    })
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('pressing AC resets the display to 0', async () => {
    renderCalculator()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '9' }))
      fireEvent.click(screen.getByRole('button', { name: 'AC' }))
    })
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('pressing DEL removes the last character', async () => {
    renderCalculator()
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '1' }))
      fireEvent.click(screen.getByRole('button', { name: '2' }))
      fireEvent.click(screen.getByRole('button', { name: '3' }))
      fireEvent.click(screen.getByRole('button', { name: 'DEL' }))
    })
    expect(screen.getByText('12')).toBeInTheDocument()
  })

  it('all non-AC keys are disabled after an error', async () => {
    renderCalculator()
    // Trigger an error by evaluating an invalid expression
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: '÷' })) // leading ÷ → error
      fireEvent.click(screen.getByRole('button', { name: '=' }))
    })
    // Wait for error state — the sin key should now be disabled
    const sinButton = screen.getByRole('button', { name: 'sin' })
    expect(sinButton).toHaveAttribute('aria-disabled', 'true')
    // AC must remain enabled
    const acButton = screen.getByRole('button', { name: 'AC' })
    expect(acButton).not.toHaveAttribute('aria-disabled', 'true')
  })

})