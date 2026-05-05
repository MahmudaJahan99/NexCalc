import { motion } from 'framer-motion'
import styles from './CalcKey.module.css'

// ── Map key types to CSS Module class names ───────────────────────────────
// This lookup keeps the variant → style mapping in ONE place.
// If you add a new variant, add it here — not scattered through the JSX.
const VARIANT_CLASSES = {
    number: styles.variantNumber,
    operator: styles.variantOperator,
    function: styles.variantFunction,
    action: styles.variantAction,
    equals: styles.variantEquals,
    clear: styles.variantClear,
    memory: styles.variantMemory,
}

// Animation definitions
const tapAnimation = {
    scale: 0.92,
    transition: { type: 'spring', stiffness: 500, damping: 30 },
}
const hoverAnimation = {
    scale: 1.02,
    transition: { type: 'spring', stiffness: 400, damping: 25 },
}

// Component
export default function CalcKey({
    label, // displayed text on the key
    variant = 'number', //controls styling: 'number'|'operator'|'function'|'action'|'equals'|'clear'|'memory'
    onClick, //called when key is pressed
    disabled = false, // blocks interaction
    keyId, //unique identifier
}) {
    const variantClass = VARIANT_CLASSES[variant] ?? styles.variantNumber

    const className = [styles.key, variantClass].join(' ')

    return (
        <motion.button
            className={className}
            onClick={disabled ? undefined : onClick}
            whileHover={disabled ? undefined : hoverAnimation}
            whileTap={disabled ? undefined : tapAnimation}
            data-key-id={keyId}
            data-variant={variant}
            aria-label={label}
            aria-disabled={disabled}
            type="button"
        >
            {/* Function keys get a tiny accent dot — sci-fi hardware detail */}
            {variant === 'function' && <span className={styles.accentDot} aria-hidden="true" />}

            <span className={styles.label}>{label}</span>
        </motion.button>
    )
}