import { evaluate } from '../utils/mathEngine'
import { MAX_DISPLAY_DIGITS } from '../constants/keys'

// ACTION TYPES
export const ACTIONS = {
  INPUT: 'INPUT', // user pressed a key (number, operator, function)
  EVALUATE: 'EVALUATE', // user pressed =
  CLEAR: 'CLEAR', // AC — full reset
  DELETE: 'DELETE', // DEL — remove last character
  SET_ANGLE_MODE: 'SET_ANGLE_MODE', // switch DEG / RAD / GRAD
  TOGGLE_SIGN: 'TOGGLE_SIGN', // flip sign of current entry
}

// INITIAL STATE
export const initialState = {
  expression: '', // the full expression string
  displayValue: '0', // primary display line
  lastAnswer: null, // stored ANS for the ANS key
  angleMode: 'DEG', // 'DEG' | 'RAD' | 'GRAD'
  isError: false, // true when the last evaluation threw
  errorMessage: '', // Error message
  justEvaluated: false, // true right after = so next digit starts fresh
}

// HELPERS
const OPERATORS = ['+', '-', '*', '/', '^', '%']

function isOperator(value) {
  return OPERATORS.includes(value)
}

// REDUCER
export function calculatorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INPUT: {
      const { value } = action.payload

      // Block all input during error (only AC works)
      if (state.isError) return state

      // Cap expression length to prevent overflow
      if (state.expression.length >= MAX_DISPLAY_DIGITS && !isOperator(value)) {
        return state
      }

      // Handle post-evaluation input
      if (state.justEvaluated) {
        if (isOperator(value)) {
          // If it's an operator, start new expression with last answer
          const newExpr = String(state.lastAnswer) + value
          return {
            ...state,
            expression: newExpr,
            displayValue: newExpr,
            justEvaluated: false,
          }
        } else {
          // If it's a digit/function, start fresh
          return {
            ...state,
            expression: value,
            displayValue: value,
            justEvaluated: false,
          }
        }
      }

      // Prevent double decimal in current number segment
      if (value === '.') {
        const parts = state.expression.split(/[\+\-\*\/\^\%\(]/)
        const currentSegment = parts[parts.length - 1]
        if (currentSegment.includes('.')) return state
      }

      // Prevent leading operator (except minus for negation)
      if (state.expression === '' && isOperator(value) && value !== '-') {
        return state
      }

      // Normal append
      const newExpression = state.expression + value
      return {
        ...state,
        expression: newExpression,
        displayValue: newExpression,
        isError: false,
      }
    }

    case ACTIONS.EVALUATE: {
      if (!state.expression || state.isError) return state

      const { result, error } = evaluate(
        state.expression,
        state.angleMode,
        state.lastAnswer
      )

      if (error) {
        return {
          ...state,
          isError: true,
          errorMessage: error,
          displayValue: error,
        }
      }

      return {
        ...state,
        displayValue: result,
        lastAnswer: parseFloat(result),
        expression: result,
        isError: false,
        errorMessage: '',
        justEvaluated: true,
      }
    }

    // Preserve angleMode — don't reset on AC
    case ACTIONS.CLEAR: {
      return { ...initialState, angleMode: state.angleMode }
    }

    case ACTIONS.DELETE: {
      // After evaluation or error, DEL clears fully
      if (state.justEvaluated || state.isError) {
        return { ...initialState, angleMode: state.angleMode }
      }
      const trimmed = state.expression.slice(0, -1)
      return { ...state, expression: trimmed, displayValue: trimmed || '0' }
    }

    case ACTIONS.SET_ANGLE_MODE: {
      return { ...state, angleMode: action.payload.mode }
    }

    // Toggle sign of current entry (wrap in -() or unwrap)
    case ACTIONS.TOGGLE_SIGN: {
      if (!state.expression) return state
      let newExpr
      if (state.expression.startsWith('-(') && state.expression.endsWith(')')) {
        newExpr = state.expression.slice(2, -1)
      } else {
        newExpr = `-(${state.expression})`
      }
      return { ...state, expression: newExpr, displayValue: newExpr }
    }

    // Unknown action type
    default: {
      if (process.env.NODE_ENV !== 'production') {
        console.warn(
          `[calculatorReducer] Unknown action type: "${action.type}"`
        )
      }
      return state
    }
  }
}
