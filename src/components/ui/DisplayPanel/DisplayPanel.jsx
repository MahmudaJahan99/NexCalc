import { AnimatePresence, motion } from 'framer-motion'
import { useCalculator } from '../../../hooks/useCalculator'
import styles from './DisplayPanel.module.css'

// Get font size based on display value length
function getDisplayFontSize(value) {
    const len = value.length
    if (len <= 6) return '40px'
    if (len <= 9) return '34px'
    if (len <= 12) return '28px'
    return '22px'
}

// Animation variants for display value transitions
const valueVariants = {
    enter: { opacity: 0, y: -8 },
    center: { opacity: 1, y: 0, transition: { duration: 0.12, ease: 'easeOut' } },
    exit: { opacity: 0, y: 8, transition: { duration: 0.08, ease: 'easeIn' } },
}

export default function DisplayPanel() {
    const {
        displayValue,
        expression,
        angleMode,
        isError,
        lastAnswer,
        justEvaluated,
    } = useCalculator()

    // Derived value
    const fontSize = getDisplayFontSize(displayValue)
    const showCursor = !isError && !justEvaluated
    const showAns = justEvaluated && lastAnswer !== null
    // Show the expression line only while typing (not after evaluation result)
    const showExpression = !justEvaluated && !isError && expression.length > 0

    return (
        <div className={styles.display}>

            {/*  Status bar  */}
            <div className={styles.statusBar}>
                <span className={[styles.statusBadge, styles.statusBadgeAngle].join(' ')}>
                    {angleMode}
                </span>

                {isError && (
                    <span className={[styles.statusBadge, styles.statusBadgeError].join(' ')}>
                        ERR
                    </span>
                )}

                {showAns && (
                    <span className={[styles.statusBadge, styles.statusBadgeAns].join(' ')}>
                        ANS
                    </span>
                )}
            </div>

            {showExpression && (
                <div className={styles.expressionLine}>
                    {expression}
                </div>
            )}

            {/* Main display value (animated) */}
            <div
                className={[styles.mainValue, isError ? styles.mainValueError : ''].join(' ')}
                style={{ '--display-font-size': fontSize }}
            >
                <AnimatePresence mode="popLayout">
                    <motion.span
                        key={displayValue}
                        variants={valueVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    >
                        {displayValue}
                    </motion.span>
                </AnimatePresence>

                {/* Blinking cursor when user is actively typing */}
                {showCursor && <span className={styles.cursor} aria-hidden="true" />}
            </div>

            {/*  Brand mark  */}
            <span className={styles.brandMark} aria-hidden="true">NEXCALC</span>
        </div>
    )
}