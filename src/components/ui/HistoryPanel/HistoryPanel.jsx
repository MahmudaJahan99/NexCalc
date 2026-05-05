import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useCalculator } from '../../../hooks/useCalculator'
import styles from './HistoryPanel.module.css'

// Constants for animation variants
const panelVariants = {
    closed: {
        height: 0,
        opacity: 0,
        transition: { duration: 0.2, ease: 'easeIn' },
    },
    open: {
        height: 'auto',
        opacity: 1,
        transition: { duration: 0.25, ease: 'easeOut' },
    },
}

// Entry animation for items entering the list
const entryVariants = {
    initial: { opacity: 0, x: 12 },
    animate: { opacity: 1, x: 0, transition: { duration: 0.15 } },
    exit: { opacity: 0, x: -12, transition: { duration: 0.1 } },
}

// Format a timestamp into a readable relative label
function formatTime(timestamp) {
    const diff = Date.now() - timestamp
    if (diff < 60_000) return 'just now'
    if (diff < 3600_000) return `${Math.floor(diff / 60_000)}m ago`
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Component
export default function HistoryPanel({ entries, onDelete, onClear }) {
    // Local UI state — only this component cares if the panel is open
    const [isOpen, setIsOpen] = useState(false)

    // Global calculator actions — to inject a past result back into the calc
    const { handleInput, handleClear } = useCalculator()

    function handleEntryClick(result) {
        // Inject the past result as the new calculator input
        handleClear()
        handleInput(result)
        setIsOpen(false)  // collapse panel after selection
    }

    return (
        <div>
            {/* Toggle button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '6px' }}>
                <button
                    className={[styles.toggleBtn, isOpen ? styles.active : ''].join(' ')}
                    onClick={() => setIsOpen(o => !o)}
                    aria-expanded={isOpen}
                    aria-controls="history-panel"
                >
                    HIST
                    {entries.length > 0 && (
                        <span className={styles.countBadge}>{entries.length}</span>
                    )}
                </button>
            </div>

            {/* Animated panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        id="history-panel"
                        key="history-panel"
                        className={styles.panel}
                        variants={panelVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        style={{ overflow: 'hidden' }}
                    >
                        {/* Panel header */}
                        <div className={styles.panelHeader}>
                            <span className={styles.panelTitle}>Calculation History</span>
                            {entries.length > 0 && (
                                <button
                                    className={styles.clearBtn}
                                    onClick={onClear}
                                    aria-label="Clear all history"
                                >
                                    CLEAR ALL
                                </button>
                            )}
                        </div>

                        {/* Entry list */}
                        <div className={styles.list} role="list">
                            {entries.length === 0 ? (
                                <div className={styles.empty}>NO HISTORY YET</div>
                            ) : (
                                <AnimatePresence initial={false}>
                                    {entries.map(entry => (
                                        <motion.div
                                            key={entry.id}
                                            role="listitem"
                                            className={styles.entry}
                                            variants={entryVariants}
                                            initial="initial"
                                            animate="animate"
                                            exit="exit"
                                            onClick={() => handleEntryClick(entry.result)}
                                            title={`Click to use ${entry.result}`}
                                        >
                                            <span className={styles.entryArrow}>▶</span>
                                            <div className={styles.entryContent}>
                                                <div className={styles.entryExpression}>
                                                    {entry.expression} — {formatTime(entry.timestamp)}
                                                </div>
                                                <div className={styles.entryResult}>{entry.result}</div>
                                            </div>
                                            <button
                                                className={styles.deleteBtn}
                                                onClick={e => {
                                                    e.stopPropagation()  // don't also trigger the row click
                                                    onDelete(entry.id)
                                                }}
                                                aria-label={`Delete entry: ${entry.expression}`}
                                            >
                                                ×
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}