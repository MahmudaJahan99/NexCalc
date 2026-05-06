import React, { useCallback } from 'react'
import { CALCULATOR_KEYS, KEY_TYPES } from '@/constants/keys'
import { useCalculator } from '../../../hooks/useCalculator'
import CalcKey from '@/components/ui/CalcKey'
import styles from './KeyPad.module.css'

// Determine the visual variant for a key based on its type and value
function getVariant(key) {
    if (key.value === 'clear') return 'clear'
    if (key.value === '=') return 'equals'
    if (key.type === KEY_TYPES.MEMORY) return 'memory'
    if (key.type === KEY_TYPES.FUNCTION) return 'function'
    if (key.type === KEY_TYPES.OPERATOR) return 'operator'
    if (key.type === KEY_TYPES.ACTION) return 'action'
    return 'number'
}

// Set of key indices before which to insert a row divider
const DIVIDER_BEFORE = new Set([10])

export default function KeyPad() {
    const {
        handleInput,
        handleEvaluate,
        handleClear,
        handleDelete,
        handleAngleModeToggle,
        isError,
    } = useCalculator()

    // Handle key presses
    const handleKeyPress = useCallback(
        (keyValue) => {
            switch (keyValue) {
                case '=':
                    handleEvaluate()
                    break
                case 'clear':
                    handleClear()
                    break
                case 'delete':
                    handleDelete()
                    break
                case 'mode':
                    handleAngleModeToggle()
                    break
                // SHIFT and ALPHA are placeholder for future features
                case 'shift':
                case 'alpha':
                    break
                default:
                    handleInput(keyValue)
            }
        },
        [handleInput, handleEvaluate, handleClear, handleDelete, handleAngleModeToggle]
    )

    return (
        <div className={styles.keypad} role="group" aria-label="Calculator keys">
            {CALCULATOR_KEYS.map((key, index) => {
                // Determine if this key should be disabled
                // During error state: only AC (clear) remains active
                const isDisabled = isError && key.value !== 'clear'

                return (
                    <React.Fragment key={key.id}>
                        {/* Insert a row divider before specific rows */}
                        {DIVIDER_BEFORE.has(index) && (
                            <div
                                key={`divider-${index}`}
                                className={styles.rowDivider}
                                aria-hidden="true"
                            />
                        )}

                        <div
                            key={key.id}
                            className={styles.keyCell}
                            style={{ '--stagger-index': index }}
                        >
                            <CalcKey
                                keyId={key.id}
                                label={key.label}
                                variant={getVariant(key)}
                                onClick={() => handleKeyPress(key.value)}
                                disabled={isDisabled}
                            />
                        </div>
                    </React.Fragment>
                )
            })}
        </div>
    )
}