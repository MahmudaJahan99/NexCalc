// All calculator button definitions live here as data.

export const KEY_TYPES = {
  NUMBER: 'number',
  OPERATOR: 'operator',
  FUNCTION: 'function',
  ACTION: 'action',
  MEMORY: 'memory',
}

// Each key: { id, label, value, type, span? }
export const CALCULATOR_KEYS = [
  // Row 1 — Mode & memory
  { id: 'shift',  label: 'SHIFT',  value: 'shift',  type: KEY_TYPES.ACTION },
  { id: 'alpha',  label: 'ALPHA',  value: 'alpha',  type: KEY_TYPES.ACTION },
  { id: 'mode',   label: 'MODE',   value: 'mode',   type: KEY_TYPES.ACTION },
  { id: 'del',    label: 'DEL',    value: 'delete', type: KEY_TYPES.ACTION },
  { id: 'ac',     label: 'AC',     value: 'clear',  type: KEY_TYPES.ACTION },

  // Row 2 — Scientific functions
  { id: 'sin',    label: 'sin',    value: 'sin(',   type: KEY_TYPES.FUNCTION },
  { id: 'cos',    label: 'cos',    value: 'cos(',   type: KEY_TYPES.FUNCTION },
  { id: 'tan',    label: 'tan',    value: 'tan(',   type: KEY_TYPES.FUNCTION },
  { id: 'log',    label: 'log',    value: 'log10(',   type: KEY_TYPES.FUNCTION },
  { id: 'ln',     label: 'ln',     value: 'log(',   type: KEY_TYPES.FUNCTION },

  // Row 3 — Powers & roots
  { id: 'sqrt',   label: '√',      value: 'sqrt(',  type: KEY_TYPES.FUNCTION },
  { id: 'sq',     label: 'x²',     value: '^2',     type: KEY_TYPES.FUNCTION },
  { id: 'pow',    label: 'xʸ',     value: '^',      type: KEY_TYPES.OPERATOR },
  { id: 'lparen', label: '(',      value: '(',      type: KEY_TYPES.OPERATOR },
  { id: 'rparen', label: ')',      value: ')',      type: KEY_TYPES.OPERATOR },

  // Row 4 — Numbers 7-9 + operations
  { id: 'seven',  label: '7',      value: '7',      type: KEY_TYPES.NUMBER },
  { id: 'eight',  label: '8',      value: '8',      type: KEY_TYPES.NUMBER },
  { id: 'nine',   label: '9',      value: '9',      type: KEY_TYPES.NUMBER },
  { id: 'div',    label: '÷',      value: '/',      type: KEY_TYPES.OPERATOR },
  { id: 'mod',    label: 'mod',    value: '%',      type: KEY_TYPES.OPERATOR },

  // Row 5 — Numbers 4-6 + operations
  { id: 'four',   label: '4',      value: '4',      type: KEY_TYPES.NUMBER },
  { id: 'five',   label: '5',      value: '5',      type: KEY_TYPES.NUMBER },
  { id: 'six',    label: '6',      value: '6',      type: KEY_TYPES.NUMBER },
  { id: 'mul',    label: '×',      value: '*',      type: KEY_TYPES.OPERATOR },
  { id: 'pi',     label: 'π',      value: 'pi',     type: KEY_TYPES.FUNCTION },

  // Row 6 — Numbers 1-3 + operations
  { id: 'one',    label: '1',      value: '1',      type: KEY_TYPES.NUMBER },
  { id: 'two',    label: '2',      value: '2',      type: KEY_TYPES.NUMBER },
  { id: 'three',  label: '3',      value: '3',      type: KEY_TYPES.NUMBER },
  { id: 'sub',    label: '−',      value: '-',      type: KEY_TYPES.OPERATOR },
  { id: 'ans',    label: 'ANS',    value: 'ans',    type: KEY_TYPES.MEMORY },

  // Row 7 — Zero, decimal, equals
  { id: 'zero',   label: '0',      value: '0',      type: KEY_TYPES.NUMBER },
  { id: 'dot',    label: '.',      value: '.',      type: KEY_TYPES.NUMBER },
  { id: 'exp',    label: '×10ˣ',   value: 'e',      type: KEY_TYPES.FUNCTION },
  { id: 'add',    label: '+',      value: '+',      type: KEY_TYPES.OPERATOR },
  { id: 'equals', label: '=',      value: '=',      type: KEY_TYPES.ACTION },
]

export const ANGLE_MODES = {
  DEG: 'DEG',
  RAD: 'RAD',
  GRAD: 'GRAD',
}

export const MAX_DISPLAY_DIGITS = 15