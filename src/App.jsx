import './App.css'
import { CalculatorProvider } from './context/CalculatorContext'

function CalculatorPlaceholder() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      gap: '12px',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', color: 'var(--color-cyan)', letterSpacing: '6px', fontSize: '24px' }}>
        NEXCALC
      </p>
      <p style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-text-secondary)', letterSpacing: '3px', fontSize: '11px' }}>
        CONTEXT + REDUCER ONLINE // AWAITING UI
      </p>
    </div>
  )
}

function App() {
  return (
    <CalculatorProvider>
      <CalculatorPlaceholder />
    </CalculatorProvider>
  )
}

export default App
