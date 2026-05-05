import './App.css'
import { CalculatorProvider } from './context/CalculatorContext'
import CalculatorShell from './components/layout/CalculatorShell'

function App() {
  return (
    <CalculatorProvider>
      <CalculatorShell />
    </CalculatorProvider>
  )
}

export default App
