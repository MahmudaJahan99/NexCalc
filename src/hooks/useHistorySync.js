// src/hooks/useHistorySync.js
import { useEffect } from 'react'
import { useCalculator } from './useCalculator'

export function useHistorySync(addEntry) {
  const { displayValue, prevExpression, justEvaluated, isError } =
    useCalculator()

  useEffect(() => {
    if (justEvaluated && !isError && displayValue && displayValue !== '0') {
      addEntry(prevExpression, displayValue)
    }
  }, [justEvaluated, isError, displayValue, prevExpression, addEntry])
}
