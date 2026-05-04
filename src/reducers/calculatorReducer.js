// Action Types
export const ACTIONS = {
  INPUT: 'INPUT', // user pressed a key (number, operator, function)
  EVALUATE: 'EVALUATE', // user pressed =
  CLEAR: 'CLEAR', // AC — full reset
  DELETE: 'DELETE', // DEL — remove last character
  SET_ANGLE_MODE: 'SET_ANGLE_MODE', // switch DEG / RAD / GRAD
}

// Initial State
export const initialState = {
  expression: '', // the full expression string
  displayValue: '0', // primary display line
  lastAnswer: null, // stored ANS for the ANS key
  angleMode: 'DEG', // 'DEG' | 'RAD' | 'GRAD'
  isError: false, // true when the last evaluation threw
  errorMessage: '', // Error message
  justEvaluated: false, // true right after = so next digit starts fresh
}

// Reducer
export function calculatorReducer(state, action) {
  switch (action.type) {
    case ACTIONS.INPUT: {
      // TODO: Build this out in the next step
      // action.payload = { value: '7' } or { value: 'sin(' } etc.
      const newExpression = state.expression + action.payload.value
      return {
        ...state,
        expression: newExpression,
        displayValue: newExpression,
        isError: false,
        justEvaluated: false,
      }
    }

    case ACTIONS.EVALUATE: {
      // TODO: Wire to mathEngine.evaluate() in the next step
      return { ...state }
    }

    case ACTIONS.CLEAR: {
      return { ...initialState, angleMode: state.angleMode }
      //   angle mode is preserved after AC.
    }

    case ACTIONS.DELETE: {
      const trimmed = state.expression.slice(0, -1)
      return {
        ...state,
        expression: trimmed,
        displayValue: trimmed || '0',
      }
    }

    case ACTIONS.SET_ANGLE_MODE: {
      return { ...state, angleMode: action.payload.mode }
    }

    default:
      return state
  }
}
