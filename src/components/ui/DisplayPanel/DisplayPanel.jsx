import { AnimatePresence, motion } from 'framer-motion'
import { useCalculator } from '../../../hooks/useCalculator'
import styles from './DisplayPanel.module.css'
import { useRef, useEffect } from 'react'

const valueVariants = {
    enter: { opacity: 0, y: -12, scale: 0.96 },
    center: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] } },
    exit:  { opacity: 0, transition: { duration: 0.06 } },
}

// Get font size based on display value length
function getDisplayFontSize(value) {
    const len = value.length
    if (len <= 6) return '40px'
    if (len <= 9) return '34px'
    if (len <= 12) return '28px'
    return '22px'
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

    const exprRef = useRef(null)

    useEffect(() => {
        if (exprRef.current) {
            exprRef.current.scrollLeft = exprRef.current.scrollWidth
        }
    }, [expression])

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

            <div className={styles.expressionLine} ref={exprRef}>
                {showExpression && (
                    <>
                        {expression.split('').map((char, i) => {
                            const isLast = i === expression.length - 1

                            return (
                                <motion.span
                                    key={i}
                                    initial={isLast ? { opacity: 0, y: 6 } : false}
                                    animate={isLast ? { opacity: 1, y: 0 } : false}
                                    transition={{ duration: 0.12 }}
                                >
                                    {char}
                                </motion.span>
                            )
                        })}

                        {/* Cursor now lives HERE */}
                        {showCursor && <span className={styles.cursor} aria-hidden="true" />}
                    </>
                )}
            </div>

            {/* Main display value (animated) */}
            <div
                className={[styles.mainValue, isError ? styles.mainValueError : ''].join(' ')}
                style={{ '--display-font-size': fontSize }}
            >
                <AnimatePresence mode="popLayout">
                {(justEvaluated || isError) && (
                    <motion.span
                        key={displayValue}
                        variants={valueVariants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                    >
                        {displayValue}
                    </motion.span>
                )}
            </AnimatePresence>
            </div>

            {/*  Brand mark  */}
            <span className={styles.brandMark} aria-hidden="true">NEXCALC</span>
        </div>
    )
}