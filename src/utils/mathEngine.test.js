// src/utils/mathEngine.test.js
//
// Unit tests for the math engine.
// Run with: npm test
//
// ── Learning Note ──────────────────────────────────────────────────────────
// We're testing a PURE FUNCTION — it takes inputs and returns outputs.
// No React, no DOM, no mocking. This is why isolating logic into utils pays off.
// Each `it()` block tests ONE behaviour. If a test fails, you know exactly where.
// ───────────────────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import { evaluate, formatResult } from './mathEngine'

describe('evaluate()', () => {

  it('handles basic arithmetic', () => {
    expect(evaluate('2 + 2').result).toBe('4')
    expect(evaluate('10 - 3').result).toBe('7')
    expect(evaluate('6 * 7').result).toBe('42')
    expect(evaluate('10 / 4').result).toBe('2.5')
  })

  it('handles exponentiation', () => {
    expect(evaluate('2^10').result).toBe('1024')
    expect(evaluate('9^0.5').result).toBe('3')
  })

  it('evaluates trig in DEG mode', () => {
    const { result } = evaluate('sin(90)', 'DEG')
    expect(parseFloat(result)).toBeCloseTo(1, 5)
  })

  it('evaluates trig in RAD mode', () => {
    const { result } = evaluate('sin(pi/2)', 'RAD')
    expect(parseFloat(result)).toBeCloseTo(1, 5)
  })

  it('returns Syntax Error on bad input', () => {
    expect(evaluate('2 +* 3').error).toBe('Syntax Error')
    expect(evaluate('sin(').error).toBe('Syntax Error')
  })

  it('substitutes ANS correctly', () => {
    expect(evaluate('ans + 5', 'DEG', 10).result).toBe('15')
  })

})

describe('formatResult()', () => {

  it('avoids floating-point noise', () => {
    // 0.1 + 0.2 in JS = 0.30000000000000004 — we fix this
    expect(formatResult(0.1 + 0.2)).toBe('0.3')
  })

  it('uses scientific notation for large numbers', () => {
    expect(formatResult(123456789012)).toMatch(/e/)
  })

})