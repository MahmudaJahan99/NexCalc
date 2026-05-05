import { useState, useEffect, useCallback } from 'react'

// Constant
const STORAGE_KEY = 'nexcalc_history'
const MAX_HISTORY = 50 // cap to prevent unbounded localStorage growth

// Helpers for localStorage interaction
function readFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function writeToStorage(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries))
  } catch {
    // Storage full or unavailable — fail silently
  }
}

// The Hook
export function useHistory() {
  // State: the list of history entries
  const [entries, setEntries] = useState(() => readFromStorage())

  // Persist to localStorage whenever entries change
  useEffect(() => {
    writeToStorage(entries)
  }, [entries])

  // addEntry
  const addEntry = useCallback((expression, result) => {
    // Guard: don't store trivial or error entries
    if (!expression || !result || result === '0') return null

    const newEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      expression: expression.trim(),
      result: result.trim(),
      timestamp: Date.now(),
    }

    setEntries(prev => {
      // Prepend new entry (most recent first), slice to max
      const updated = [newEntry, ...prev].slice(0, MAX_HISTORY)
      return updated
    })

    return newEntry
  }, [])

  // deleteEntry
  const deleteEntry = useCallback(id => {
    setEntries(prev => prev.filter(entry => entry.id !== id))
  }, [])

  // clearHistory
  const clearHistory = useCallback(() => {
    setEntries([])
    // Also clear from localStorage to free up space immediately
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      /* empty */
    }
  }, [])

  // Return the API
  return {
    entries, // HistoryEntry[]  — the full list, newest first
    addEntry, // (expression, result) => HistoryEntry | null
    deleteEntry, // (id) => void
    clearHistory, // () => void
    hasEntries: entries.length > 0,
    count: entries.length,
  }
}
