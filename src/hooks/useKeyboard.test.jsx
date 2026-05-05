import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { CalculatorProvider } from '@/context/CalculatorContext'
import { useKeyboard } from './useKeyboard'
import { useCalculator } from '@/context/CalculatorContext'

// Helper: render the hook inside the Provider
function renderWithProvider(hook) {
  return renderHook(hook, {
    wrapper: ({ children }) => (
      <CalculatorProvider>{children}</CalculatorProvider>
    ),
  })
}

// Helper: fire a keyboard event on window
function pressKey(key) {
  act(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }))
  })
}

// Spy hook: reads context state so we can assert what changed
function useStateReader() {
  useKeyboard()
  return useCalculator()
}

describe('useKeyboard', () => {

  it('pressing digit keys updates the expression', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('4')
    pressKey('2')
    expect(result.current.expression).toBe('42')
  })

  it('pressing Enter evaluates the expression', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('6')
    pressKey('*')
    pressKey('7')
    pressKey('Enter')
    expect(result.current.displayValue).toBe('42')
    expect(result.current.justEvaluated).toBe(true)
  })

  it('pressing = also evaluates', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('5')
    pressKey('+')
    pressKey('5')
    pressKey('=')
    expect(result.current.displayValue).toBe('10')
  })

  it('pressing Backspace deletes the last character', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('1')
    pressKey('2')
    pressKey('3')
    pressKey('Backspace')
    expect(result.current.expression).toBe('12')
  })

  it('pressing Escape clears the expression', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('9')
    pressKey('9')
    pressKey('Escape')
    expect(result.current.expression).toBe('')
    expect(result.current.displayValue).toBe('0')
  })

  it('pressing Delete clears the expression', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('5')
    pressKey('Delete')
    expect(result.current.displayValue).toBe('0')
  })

  it('ignores unmapped keys', () => {
    const { result } = renderWithProvider(useStateReader)
    pressKey('q')
    pressKey('F5')
    pressKey('Tab')
    expect(result.current.expression).toBe('')  // unchanged
  })

  it('cleans up the event listener on unmount', () => {
    const removeSpy = vi.spyOn(window, 'removeEventListener')
    const { unmount } = renderWithProvider(useKeyboard)
    unmount()
    expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function))
    removeSpy.mockRestore()
  })

  it('does not double-register listeners on re-render', () => {
    const addSpy = vi.spyOn(window, 'addEventListener')
    const { rerender } = renderWithProvider(useKeyboard)
    rerender()
    rerender()
    
    // Only one 'keydown' listener should be added, even after multiple re-renders
    const keydownCalls = addSpy.mock.calls.filter(([evt]) => evt === 'keydown')
    expect(keydownCalls.length).toBe(1)
    addSpy.mockRestore()
  })

})