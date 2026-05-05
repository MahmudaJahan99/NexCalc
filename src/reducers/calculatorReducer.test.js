import { describe, it, expect } from 'vitest'
import { calculatorReducer, initialState, ACTIONS } from './calculatorReducer'

function stateWith(overrides) {
  return { ...initialState, ...overrides }
}

// ── Helper: dispatch a single action ──────────────────────────────────────
function dispatch(state, type, payload) {
  return calculatorReducer(state, { type, payload })
}

// ═════════════════════════════════════════════════════════════════════════════
describe('ACTIONS.INPUT', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('appends a digit to an empty expression', () => {
    const result = dispatch(initialState, ACTIONS.INPUT, { value: '7' })
    expect(result.expression).toBe('7')
    expect(result.displayValue).toBe('7')
  })

  it('appends multiple digits correctly', () => {
    let state = initialState
    state = dispatch(state, ACTIONS.INPUT, { value: '1' })
    state = dispatch(state, ACTIONS.INPUT, { value: '2' })
    state = dispatch(state, ACTIONS.INPUT, { value: '3' })
    expect(state.expression).toBe('123')
  })

  it('appends operators', () => {
    let state = stateWith({ expression: '5' })
    state = dispatch(state, ACTIONS.INPUT, { value: '+' })
    expect(state.expression).toBe('5+')
  })

  it('appends function keys like sin(', () => {
    let state = stateWith({ expression: '' })
    state = dispatch(state, ACTIONS.INPUT, { value: 'sin(' })
    expect(state.expression).toBe('sin(')
  })

  it('blocks input when in error state', () => {
    const errorState = stateWith({ isError: true, expression: '5+' })
    const result = dispatch(errorState, ACTIONS.INPUT, { value: '3' })
    expect(result.expression).toBe('5+') // unchanged
  })

  it('prevents leading operators (except minus)', () => {
    const result = dispatch(initialState, ACTIONS.INPUT, { value: '+' })
    expect(result.expression).toBe('') // blocked
  })

  it('allows leading minus (negation)', () => {
    const result = dispatch(initialState, ACTIONS.INPUT, { value: '-' })
    expect(result.expression).toBe('-')
  })

  it('prevents double decimal in same number', () => {
    let state = stateWith({ expression: '3.14' })
    state = dispatch(state, ACTIONS.INPUT, { value: '.' })
    expect(state.expression).toBe('3.14') // second dot blocked
  })

  it('allows decimal after operator (new number segment)', () => {
    let state = stateWith({ expression: '3.14+' })
    state = dispatch(state, ACTIONS.INPUT, { value: '.' })
    expect(state.expression).toBe('3.14+.')
  })

  // ── Post-evaluation behaviour ──────────────────────────────────────────
  it('starts fresh when digit pressed after evaluation', () => {
    const evaluated = stateWith({
      expression: '5', displayValue: '5', lastAnswer: 5, justEvaluated: true,
    })
    const result = dispatch(evaluated, ACTIONS.INPUT, { value: '7' })
    expect(result.expression).toBe('7')         // not '57'
    expect(result.justEvaluated).toBe(false)
  })

  it('continues from result when operator pressed after evaluation', () => {
    const evaluated = stateWith({
      expression: '5', displayValue: '5', lastAnswer: 5, justEvaluated: true,
    })
    const result = dispatch(evaluated, ACTIONS.INPUT, { value: '+' })
    expect(result.expression).toBe('5+')        // continues from answer
    expect(result.justEvaluated).toBe(false)
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('ACTIONS.EVALUATE', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('evaluates a simple expression', () => {
    const state = stateWith({ expression: '6*7' })
    const result = dispatch(state, ACTIONS.EVALUATE)
    expect(result.displayValue).toBe('42')
    expect(result.lastAnswer).toBe(42)
    expect(result.justEvaluated).toBe(true)
    expect(result.isError).toBe(false)
  })

  it('sets isError on invalid expression', () => {
    const state = stateWith({ expression: '2++3' })
    const result = dispatch(state, ACTIONS.EVALUATE)
    expect(result.isError).toBe(true)
    expect(result.errorMessage).toBeTruthy()
  })

  it('does nothing on empty expression', () => {
    const result = dispatch(initialState, ACTIONS.EVALUATE)
    expect(result).toEqual(initialState)
  })

  it('does nothing when already in error state', () => {
    const errorState = stateWith({ isError: true })
    const result = dispatch(errorState, ACTIONS.EVALUATE)
    expect(result.isError).toBe(true)
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('ACTIONS.CLEAR', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('resets all state to initial', () => {
    const dirty = stateWith({
      expression: '123+456', displayValue: '123+456',
      lastAnswer: 99, isError: true,
    })
    const result = dispatch(dirty, ACTIONS.CLEAR)
    expect(result.expression).toBe('')
    expect(result.displayValue).toBe('0')
    expect(result.isError).toBe(false)
    expect(result.lastAnswer).toBe(null)
  })

  it('preserves angleMode across clear', () => {
    const state = stateWith({ angleMode: 'RAD', expression: '42' })
    const result = dispatch(state, ACTIONS.CLEAR)
    expect(result.angleMode).toBe('RAD')  // not reset to 'DEG'
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('ACTIONS.DELETE', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('removes the last character', () => {
    const state = stateWith({ expression: '123' })
    const result = dispatch(state, ACTIONS.DELETE)
    expect(result.expression).toBe('12')
    expect(result.displayValue).toBe('12')
  })

  it('shows "0" when expression becomes empty after delete', () => {
    const state = stateWith({ expression: '5' })
    const result = dispatch(state, ACTIONS.DELETE)
    expect(result.expression).toBe('')
    expect(result.displayValue).toBe('0')
  })

  it('full-clears when DEL pressed after evaluation', () => {
    const evaluated = stateWith({ justEvaluated: true, expression: '42' })
    const result = dispatch(evaluated, ACTIONS.DELETE)
    expect(result.expression).toBe('')
    expect(result.justEvaluated).toBe(false)
  })

  it('full-clears when DEL pressed during error', () => {
    const errState = stateWith({ isError: true, expression: '2++' })
    const result = dispatch(errState, ACTIONS.DELETE)
    expect(result.isError).toBe(false)
    expect(result.expression).toBe('')
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('ACTIONS.SET_ANGLE_MODE', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('changes angle mode to RAD', () => {
    const result = dispatch(initialState, ACTIONS.SET_ANGLE_MODE, { mode: 'RAD' })
    expect(result.angleMode).toBe('RAD')
  })

  it('changes angle mode to GRAD', () => {
    const result = dispatch(initialState, ACTIONS.SET_ANGLE_MODE, { mode: 'GRAD' })
    expect(result.angleMode).toBe('GRAD')
  })

  it('does not affect other state values', () => {
    const state = stateWith({ expression: '3.14', lastAnswer: 42 })
    const result = dispatch(state, ACTIONS.SET_ANGLE_MODE, { mode: 'RAD' })
    expect(result.expression).toBe('3.14')
    expect(result.lastAnswer).toBe(42)
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('ACTIONS.TOGGLE_SIGN', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('wraps expression in negation', () => {
    const state = stateWith({ expression: '42' })
    const result = dispatch(state, ACTIONS.TOGGLE_SIGN)
    expect(result.expression).toBe('-(42)')
  })

  it('removes negation wrapper if already negated', () => {
    const state = stateWith({ expression: '-(42)' })
    const result = dispatch(state, ACTIONS.TOGGLE_SIGN)
    expect(result.expression).toBe('42')
  })

  it('does nothing on empty expression', () => {
    const result = dispatch(initialState, ACTIONS.TOGGLE_SIGN)
    expect(result.expression).toBe('')
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('Immutability', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('never mutates the input state', () => {
    const state = stateWith({ expression: '5' })
    const frozen = Object.freeze(state) // will throw if reducer mutates it
    expect(() => {
      dispatch(frozen, ACTIONS.INPUT, { value: '3' })
    }).not.toThrow()
  })

})

// ═════════════════════════════════════════════════════════════════════════════
describe('Unknown actions', () => {
// ═════════════════════════════════════════════════════════════════════════════

  it('returns state unchanged for unknown action types', () => {
    const state = stateWith({ expression: '99' })
    const result = calculatorReducer(state, { type: 'DOES_NOT_EXIST' })
    expect(result).toEqual(state)
  })

})