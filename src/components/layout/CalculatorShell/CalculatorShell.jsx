import { motion } from 'framer-motion'
import { useKeyboard } from '@/hooks/useKeyboard'
import { useHistory } from '@/hooks/useHistory'
import DisplayPanel from '@/components/ui/DisplayPanel'
import KeyPad from '@/components/ui/KeyPad'
import HistoryPanel from '@/components/ui/HistoryPanel'
import styles from './CalculatorShell.module.css'
import { useHistorySync } from '@/hooks/useHistorySync'

// Animation for the whole calculator shell on initial load
const shellAnimation = {
    initial: { opacity: 0, y: 24, scale: 0.97 },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] },
    },
}

// Main calculator shell component
export default function CalculatorShell() {
    // Initialize keyboard handling (global key listeners)
    useKeyboard()

    // History state and actions
    const { entries, addEntry, deleteEntry, clearHistory } = useHistory()
    useHistorySync(addEntry)

    return (
        <div className={styles.page}>
            <motion.div
                className={styles.shell}
                {...shellAnimation}
            >
                {/* Brand header */}
                <div className={styles.header}>
                    <span className={styles.brandName}>NEXCALC</span>
                    <span className={styles.modelLabel}>SCI-FX v1.0</span>
                </div>

                {/* LCD Display */}
                <DisplayPanel />

                {/* ── History Panel (toggle button + expandable list) ── */}
                <HistoryPanel
                    entries={entries}
                    onDelete={deleteEntry}
                    onClear={clearHistory}
                />

                {/* Button grid */}
                <KeyPad />

                {/* Bottom decorative edge */}
                <div className={styles.bottomEdge} aria-hidden="true" />
            </motion.div>
        </div>
    )
}