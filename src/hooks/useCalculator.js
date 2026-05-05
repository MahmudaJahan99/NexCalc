// src/hooks/useCalculator.js
import { useContext } from 'react'
import { CalculatorContext } from '../context/CalculatorContext'

export function useCalculator() {
  const context = useContext(CalculatorContext)

  if (context === null) {
    throw new Error(
      '[NEXCALC] useCalculator() must be called inside <CalculatorProvider>.\n' +
      'Fix: wrap your root in App.jsx:\n' +
      '  <CalculatorProvider><App /></CalculatorProvider>'
    )
  }

  return context
}