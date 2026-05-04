import { create, all } from 'mathjs'

// Create a mathjs instance with all functions/operators
const math = create(all)

/**\
 * Evaluate an expression string safely.
 *
 * @param {string} expression - e.g. "sin(30) + 4^2"
 * @param {string} angleMode  - 'DEG' | 'RAD' | 'GRAD'
 * @param {number|null} lastAnswer - current ANS value
 * @returns {{ result: string|null, error: string|null }}
 */

export function evaluate(expression, angleMode = 'DEG', lastAnswer = 0) {
  try {
    // Replace ANS placeholder with the actual last answer
    let expr = expression.replace(/\bans\b/gi, String(lastAnswer ?? 0))

    // mathjs uses radians internally — convert trig if user is in DEG mode
    if (angleMode === 'DEG') {
      expr = convertTrigToDeg(expr)
    }

    const raw = math.evaluate(expr)

    // mathjs can return complex objects (matrices, units) — guard against them
    if (typeof raw !== 'number') {
      return { result: null, error: 'Unsupported result type' }
    }

    if (!isFinite(raw)) {
      return { result: null, error: 'Math Error' }
    }

    // Format: avoid floating-point noise like 0.10000000000000001
    const formatted = formatResult(raw)
    return { result: formatted, error: null }

  } catch (err) {
    return { result: null, error: 'Syntax Error', err }
  }
}

// Convert user-friendly trig functions to mathjs's radian-based ones
function convertTrigToDeg(expr) {
  return expr
    .replace(/\bsin\(/g, 'sin(pi/180 * ')
    .replace(/\bcos\(/g, 'cos(pi/180 * ')
    .replace(/\btan\(/g, 'tan(pi/180 * ')
}

// Format result to avoid floating-point issues and use scientific notation when appropriate
export function formatResult(num) {
  if (Math.abs(num) >= 1e10 || (Math.abs(num) < 1e-6 && num !== 0)) {
    return num.toExponential(6).replace(/\.?0+e/, 'e')
  }
  // toPrecision(10) then parseFloat strips trailing zeros
  return String(parseFloat(num.toPrecision(10)))
}