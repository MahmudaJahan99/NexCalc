import { createContext, useReducer, useCallback, useMemo } from 'react'
import { calculatorReducer, initialState, ACTIONS } from '../reducers/calculatorReducer'
import { ANGLE_MODES } from '../constants/keys'

export const CalculatorContext = createContext(null)

export function CalculatorProvider({ children }) {
    const [state, dispatch] = useReducer(calculatorReducer, initialState)

    // Action handlers
    const handleInput = useCallback(
        value => dispatch({ type: ACTIONS.INPUT, payload: { value } }),
        [dispatch]
    )

    const handleEvaluate = useCallback(
        () => dispatch({ type: ACTIONS.EVALUATE }),
        [dispatch]
    )

    const handleClear = useCallback(
        () => dispatch({ type: ACTIONS.CLEAR }),
        [dispatch]
    )

    const handleDelete = useCallback(
        () => dispatch({ type: ACTIONS.DELETE }),
        [dispatch]
    )

    const handleToggleSign = useCallback(
        () => dispatch({ type: ACTIONS.TOGGLE_SIGN }),
        [dispatch]
    )

    // Cycle through angle modes: DEG → RAD → GRAD → DEG
    const handleAngleModeToggle = useCallback(() => {
        const modes = Object.values(ANGLE_MODES) // ['DEG', 'RAD', 'GRAD']
        const current = modes.indexOf(state.angleMode)
        const next = modes[(current + 1) % modes.length]  // wrap around
        dispatch({ type: ACTIONS.SET_ANGLE_MODE, payload: { mode: next } })
    }, [state.angleMode, dispatch])

    const contextValue = useMemo(() => ({
        // State values
        displayValue: state.displayValue,
        expression: state.expression,
        prevExpression: state.prevExpression,
        angleMode: state.angleMode,
        isError: state.isError,
        lastAnswer: state.lastAnswer,
        justEvaluated: state.justEvaluated,

        // Action handlers
        handleInput,
        handleEvaluate,
        handleClear,
        handleDelete,
        handleToggleSign,
        handleAngleModeToggle,

        // Raw dispatch (escape hatch for unusual actions)
        dispatch,

    }), [
        state,
        handleInput,
        handleEvaluate,
        handleClear,
        handleDelete,
        handleToggleSign,
        handleAngleModeToggle,
        dispatch,
    ])

    return (
        <CalculatorContext.Provider value={contextValue}>
            {children}
        </CalculatorContext.Provider>
    )
}