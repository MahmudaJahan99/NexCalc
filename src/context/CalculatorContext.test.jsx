import { describe, it, expect } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { CalculatorProvider } from './CalculatorContext'
import { useCalculator } from '../hooks/useCalculator'

function TestConsumer() {
  const {
    displayValue,
    angleMode,
    isError,
    handleInput,
    handleEvaluate,
    handleClear,
    handleDelete,
    handleAngleModeToggle,
  } = useCalculator()

  return (
    <div>
      <span data-testid="display">{displayValue}</span>
      <span data-testid="angle-mode">{angleMode}</span>
      <span data-testid="is-error">{String(isError)}</span>

      <button onClick={() => handleInput('5')}>5</button>
      <button onClick={() => handleInput('+')}>+</button>
      <button onClick={() => handleInput('3')}>3</button>
      <button onClick={handleEvaluate}>=</button>
      <button onClick={handleClear}>AC</button>
      <button onClick={handleDelete}>DEL</button>
      <button onClick={handleAngleModeToggle}>MODE</button>
    </div>
  )
}

// ── Helper: render inside Provider ──────────────────────────────────────────
function renderWithProvider(ui) {
  return render(<CalculatorProvider>{ui}</CalculatorProvider>)
}

// ═════════════════════════════════════════════════════════════════════════════
describe('CalculatorContext', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('provides initial state correctly', () => {
    renderWithProvider(<TestConsumer />)
    expect(screen.getByTestId('display').textContent).toBe('0')
    expect(screen.getByTestId('angle-mode').textContent).toBe('DEG')
    expect(screen.getByTestId('is-error').textContent).toBe('false')
  })

  it('evaluates 5+3=8 through the full context→reducer→mathEngine chain', async () => {
    renderWithProvider(<TestConsumer />)

    await act(async () => {
      screen.getByText('5').click()
      screen.getByText('+').click()
      screen.getByText('3').click()
    })

    expect(screen.getByTestId('display').textContent).toBe('5+3')

    await act(async () => {
      screen.getByText('=').click()
    })

    expect(screen.getByTestId('display').textContent).toBe('8')
  })

  it('resets to 0 after AC', async () => {
    renderWithProvider(<TestConsumer />)

    await act(async () => {
      screen.getByText('5').click()
      screen.getByText('AC').click()
    })

    expect(screen.getByTestId('display').textContent).toBe('0')
  })

  it('cycles angle mode on toggle', async () => {
    renderWithProvider(<TestConsumer />)

    await act(async () => screen.getByText('MODE').click())
    expect(screen.getByTestId('angle-mode').textContent).toBe('RAD')

    await act(async () => screen.getByText('MODE').click())
    expect(screen.getByTestId('angle-mode').textContent).toBe('GRAD')

    await act(async () => screen.getByText('MODE').click())
    expect(screen.getByTestId('angle-mode').textContent).toBe('DEG')
  })

  it('throws a helpful error when used outside Provider', () => {
    // Suppress React's error boundary console output in tests
    const consoleError = console.error
    console.error = () => {}

    expect(() => render(<TestConsumer />)).toThrow(
      /useCalculator\(\) must be called inside <CalculatorProvider>/
    )

    console.error = consoleError
  })

})