import { motion } from 'framer-motion'
import DisplayPanel from '@/components/ui/DisplayPanel'
import KeyPad from '@/components/ui/KeyPad'
import styles from './CalculatorShell.module.css'

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
    return (
        <div className={styles.page}>
            <motion.div
                className={styles.shell}
                initial={shellAnimation.initial}
                animate={shellAnimation.animate}
            >
                {/* Brand header */}
                <div className={styles.header}>
                    <span className={styles.brandName}>NEXCALC</span>
                    <span className={styles.modelLabel}>SCI-FX v1.0</span>
                </div>

                {/* LCD Display */}
                <DisplayPanel />

                {/* Button grid */}
                <KeyPad />

                {/* Bottom decorative edge */}
                <div className={styles.bottomEdge} aria-hidden="true" />
            </motion.div>
        </div>
    )
}