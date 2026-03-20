import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionLog from '../components/ActionLog'

export default function StackVisualizer({ speed }) {
  const [stack, setStack] = useState([3, 7, 12, 5])
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState(null)
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — stack initialized with [3, 7, 12, 5]' }])
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const push = async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Push ${val} — adding to top of stack`, 'info')
    setStack(prev => [...prev, val])
    setHighlight(stack.length)
    log(`${val} placed at top (index ${stack.length})`, 'step')
    await delay()
    setHighlight(null)
    log(`Push complete — stack size: ${stack.length + 1}`, 'success')
    setRunning(false)
  }

  const pop = async () => {
    if (!stack.length) { log('Stack underflow — cannot pop from empty stack', 'error'); return }
    setRunning(true)
    const top = stack[stack.length - 1]
    log(`Pop — removing top element ${top}`, 'info')
    setHighlight(stack.length - 1)
    log(`Highlighting top element: ${top}`, 'step')
    await delay()
    setStack(prev => prev.slice(0, -1))
    setHighlight(null)
    log(`Popped ${top} — stack size: ${stack.length - 1}`, 'success')
    setRunning(false)
  }

  const peek = async () => {
    if (!stack.length) { log('Stack is empty — nothing to peek', 'error'); return }
    const top = stack[stack.length - 1]
    log(`Peek — inspecting top element`, 'info')
    setHighlight(stack.length - 1)
    log(`Top element is ${top} (no removal)`, 'success')
    await delay()
    setHighlight(null)
  }

  const reset = () => {
    setStack([3, 7, 12, 5])
    setLogs([{ type: 'step', msg: 'Reset — stack restored to [3, 7, 12, 5]' }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <button className="btn btn-primary btn-sm" onClick={push} disabled={running}>Push</button>
        <button className="btn btn-danger btn-sm" onClick={pop} disabled={running}>Pop</button>
        <button className="btn btn-info btn-sm" onClick={peek} disabled={running}>Peek</button>
        <button className="btn btn-warning btn-sm" onClick={reset} disabled={running}>Reset</button>
      </div>
      <div className="viz-area" style={{ flexDirection: 'column-reverse', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 120, height: 4, background: 'var(--primary)', borderRadius: 2, marginTop: 4, opacity: 0.4 }} />
        <AnimatePresence mode="popLayout">
          {stack.map((val, i) => (
            <motion.div key={`${i}-${val}`}
              initial={{ scaleX: 0, opacity: 0, y: -30 }} animate={{ scaleX: 1, opacity: 1, y: 0 }}
              exit={{ scaleX: 0, opacity: 0, y: -30 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ position: 'relative' }}
            >
              <div style={{
                width: 120, height: 44, borderRadius: 8, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontWeight: 700, fontSize: 16,
                background: highlight === i ? 'rgba(245,158,11,0.15)' : 'var(--surface2)',
                border: `2px solid ${highlight === i ? 'var(--warning)' : 'var(--border)'}`,
                boxShadow: highlight === i ? '0 0 14px rgba(245,158,11,0.3)' : 'var(--shadow-sm)',
                color: 'var(--text)',
              }}>
                {val}
                {i === stack.length - 1 && (
                  <span style={{ position: 'absolute', right: -52, fontSize: 10, color: 'var(--primary-dark)', fontWeight: 700 }}>← TOP</span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        {stack.length === 0 && <span style={{ color: 'var(--text3)', fontSize: 13 }}>Stack is empty</span>}
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>Size: {stack.length}</div>
      <ActionLog logs={logs} />
    </div>
  )
}
