import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useHistory } from './useHistory'

// Mock localStorage for testing
function createLocalStorageMock() {
  let store = {}
  return {
    getItem:    vi.fn(key => store[key] ?? null),
    setItem:    vi.fn((key, value) => { store[key] = String(value) }),
    removeItem: vi.fn(key => { delete store[key] }),
    clear:      vi.fn(() => { store = {} }),
    _store: store,  // expose for inspection
  }
}

let localStorageMock

beforeEach(() => {
  localStorageMock = createLocalStorageMock()
  vi.stubGlobal('localStorage', localStorageMock)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

// tests for useHistory hook
describe('useHistory', () => {

  describe('initial state', () => {

    it('starts with empty entries when localStorage is empty', () => {
      const { result } = renderHook(() => useHistory())
      expect(result.current.entries).toEqual([])
      expect(result.current.hasEntries).toBe(false)
      expect(result.current.count).toBe(0)
    })

    it('reads persisted entries from localStorage on mount', () => {
      const existing = [
        { id: 'abc', expression: '2+2', result: '4', timestamp: 1000 }
      ]
      localStorageMock.getItem.mockReturnValueOnce(JSON.stringify(existing))

      const { result } = renderHook(() => useHistory())
      expect(result.current.entries).toHaveLength(1)
      expect(result.current.entries[0].expression).toBe('2+2')
    })

    it('gracefully handles corrupted localStorage data', () => {
      localStorageMock.getItem.mockReturnValueOnce('not valid json {{{')
      const { result } = renderHook(() => useHistory())
      expect(result.current.entries).toEqual([])  // falls back to empty
    })

  })

  describe('addEntry', () => {

    it('adds a new entry to the top of the list', () => {
      const { result } = renderHook(() => useHistory())

      act(() => { result.current.addEntry('3*3', '9') })

      expect(result.current.entries).toHaveLength(1)
      expect(result.current.entries[0].expression).toBe('3*3')
      expect(result.current.entries[0].result).toBe('9')
    })

    it('prepends entries — newest is first', () => {
      const { result } = renderHook(() => useHistory())

      act(() => { result.current.addEntry('1+1', '2') })
      act(() => { result.current.addEntry('5*5', '25') })

      expect(result.current.entries[0].expression).toBe('5*5')
      expect(result.current.entries[1].expression).toBe('1+1')
    })

    it('generates a unique id for each entry', () => {
      const { result } = renderHook(() => useHistory())

      act(() => { result.current.addEntry('1+1', '2') })
      act(() => { result.current.addEntry('2+2', '4') })

      const ids = result.current.entries.map(e => e.id)
      expect(new Set(ids).size).toBe(2)  // all unique
    })

    it('includes a timestamp on each entry', () => {
      const { result } = renderHook(() => useHistory())
      const before = Date.now()
      act(() => { result.current.addEntry('7*6', '42') })
      const after = Date.now()

      const ts = result.current.entries[0].timestamp
      expect(ts).toBeGreaterThanOrEqual(before)
      expect(ts).toBeLessThanOrEqual(after)
    })

    it('does not add trivial entries (empty expression or result "0")', () => {
      const { result } = renderHook(() => useHistory())

      act(() => { result.current.addEntry('', '42') })
      act(() => { result.current.addEntry('5', '0') })
      act(() => { result.current.addEntry('', '') })

      expect(result.current.entries).toHaveLength(0)
    })

    it('returns the new entry object', () => {
      const { result } = renderHook(() => useHistory())
      let entry
      act(() => { entry = result.current.addEntry('pi', '3.141592654') })
      expect(entry).not.toBeNull()
      expect(entry.expression).toBe('pi')
    })

    it('caps history at MAX_HISTORY entries', () => {
      const { result } = renderHook(() => useHistory())

      // Add 55 entries — should be capped at 50
      act(() => {
        for (let i = 0; i < 55; i++) {
          result.current.addEntry(`${i}+1`, String(i + 1))
        }
      })

      expect(result.current.entries).toHaveLength(50)
    })

  })

  describe('deleteEntry', () => {

    it('removes the entry with the matching id', () => {
      const { result } = renderHook(() => useHistory())

      act(() => { result.current.addEntry('1+1', '2') })
      act(() => { result.current.addEntry('9*9', '81') })

      const idToDelete = result.current.entries[1].id  // the older one

      act(() => { result.current.deleteEntry(idToDelete) })

      expect(result.current.entries).toHaveLength(1)
      expect(result.current.entries[0].expression).toBe('9*9')
    })

    it('does nothing for a non-existent id', () => {
      const { result } = renderHook(() => useHistory())
      act(() => { result.current.addEntry('1+1', '2') })
      act(() => { result.current.deleteEntry('does-not-exist') })
      expect(result.current.entries).toHaveLength(1)
    })

  })

  describe('clearHistory', () => {

    it('removes all entries from state', () => {
      const { result } = renderHook(() => useHistory())

      act(() => { result.current.addEntry('1+1', '2') })
      act(() => { result.current.addEntry('2+2', '4') })
      act(() => { result.current.clearHistory() })

      expect(result.current.entries).toHaveLength(0)
      expect(result.current.hasEntries).toBe(false)
    })

    it('removes the key from localStorage', () => {
      const { result } = renderHook(() => useHistory())
      act(() => { result.current.addEntry('1+1', '2') })
      act(() => { result.current.clearHistory() })
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('nexcalc_history')
    })

  })

  describe('localStorage persistence', () => {

    it('writes to localStorage after each addEntry', () => {
      const { result } = renderHook(() => useHistory())
      act(() => { result.current.addEntry('2^8', '256') })

      expect(localStorageMock.setItem).toHaveBeenCalled()
      const [key, value] = localStorageMock.setItem.mock.calls.at(-1)
      expect(key).toBe('nexcalc_history')
      expect(JSON.parse(value)[0].expression).toBe('2^8')
    })

    it('does not crash when localStorage.setItem throws', () => {
      localStorageMock.setItem.mockImplementationOnce(() => {
        throw new Error('QuotaExceededError')
      })
      const { result } = renderHook(() => useHistory())
      // This should NOT throw
      expect(() => {
        act(() => { result.current.addEntry('1+1', '2') })
      }).not.toThrow()
    })

  })

})