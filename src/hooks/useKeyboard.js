import { useEffect, useCallback, useRef } from 'react'
import { useCalculator } from '../hooks/useCalculator'

const KEY_MAP = {
  // Digits
  0: '0',
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',

  // Operators
  '+': '+',
  '-': '-',
  '*': '*',
  '/': '/',
  '%': '%',
  '^': '^',

  // Grouping
  '(': '(',
  ')': ')',
  '.': '.',

  // Actions (mapped to internal names)
  Enter: '__evaluate',
  '=': '__evaluate',
  Backspace: '__delete',
  Delete: '__clear',
  Escape: '__clear',
}

// Helper: check if user is typing in an input field (to avoid hijacking keys)
function isTypingInInput(event) {
  const tag = event.target?.tagName
  return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
}

// THE HOOK
export function useKeyboard() {
  const { handleInput, handleEvaluate, handleClear, handleDelete } =
    useCalculator()

  // Store the last pressed key for visual feedback in KeyPad (flashing keys on press)
  const lastPressedKeyRef = useRef(null)

  // Keydown handler: maps physical keys to calculator actions
  const handleKeyDown = useCallback(
    event => {
      // Skip if user is typing in a form field
      if (isTypingInInput(event)) return

      const mapped = KEY_MAP[event.key]
      if (!mapped) return // unmapped key — ignore it

      event.preventDefault()

      // Store for visual flash feedback
      lastPressedKeyRef.current = event.key

      // Dispatch the right action
      if (mapped === '__evaluate') {
        handleEvaluate()
      } else if (mapped === '__delete') {
        handleDelete()
      } else if (mapped === '__clear') {
        handleClear()
      } else {
        handleInput(mapped)
      }
    },
    [handleInput, handleEvaluate, handleClear, handleDelete]
  )

  // Set up the event listener on mount and clean up on unmount
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyDown])

  return { lastPressedKeyRef }
}
