import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionLog from '../components/ActionLog'

export default function QueueVisualizer({ speed }) {
  const [queue, setQueue] = useState([8, 15, 3, 22, 11])
  const [input, setInput] = useState('')
  const [highlight, setHighlight] = useState(null)
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — queue initialized with [8, 15, 3, 22, 11]' }])
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const enqueue = async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Enqueue ${val} — adding to rear of queue`, 'info')
    setQueue(prev => [...prev, val])
    setHighlight('rear')
    log(`${val} placed at rear (position ${queue.length})`, 'step')
    await delay()
    setHighlight(null)
    log(`Enqueue complete — queue size: ${queue.length + 1}`, 'success')
    setRunning(false)
  }

  const dequeue = async () => {
    if (!queue.length) { log('Queue is empty — cannot dequeue', 'error'); return }
    setRunning(true)
    const front = queue[0]
    log(`Dequeue — removing front element ${front}`, 'info')
    setHighlight('front')
    log(`Highlighting front element: ${front}`, 'step')
    await delay()
    setQueue(prev => prev.slice(1))
    setHighlight(null)
    log(`Dequeued ${front} — queue size: ${queue.length - 1}`, 'success')
    setRunning(false)
  }

  const peek = async () => {
    if (!queue.length) { log('Queue is empty — nothing to peek', 'error'); return }
    log(`Peek — inspecting front element`, 'info')
    setHighlight('front')
    log(`Front element is ${queue[0]} (no removal)`, 'success')
    await delay()
    setHighlight(null)
  }

  const reset = () => {
    setQueue([8, 15, 3, 22, 11])
    setLogs([{ type: 'step', msg: 'Reset — queue restored to [8, 15, 3, 22, 11]' }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <button className="btn btn-primary btn-sm" onClick={enqueue} disabled={running}>Enqueue</button>
        <button className="btn btn-danger btn-sm" onClick={dequeue} disabled={running}>Dequeue</button>
        <button className="btn btn-info btn-sm" onClick={peek} disabled={running}>Peek</button>
        <button className="btn btn-warning btn-sm" onClick={reset} disabled={running}>Reset</button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--primary-dark)', fontWeight: 700, padding: '0 4px' }}>
          <span>&larr; DEQUEUE (Front)</span>
          <span>(Rear) ENQUEUE &rarr;</span>
        </div>
        <div className="viz-area" style={{ gap: 6, justifyContent: 'center', alignItems: 'center' }}>
          <AnimatePresence mode="popLayout">
            {queue.map((val, i) => (
              <motion.div key={`${i}-${val}`}
                initial={{ scale: 0, opacity: 0, x: 40 }} animate={{ scale: 1, opacity: 1, x: 0 }}
                exit={{ scale: 0, opacity: 0, x: -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <div style={{
                  width: 52, height: 52, borderRadius: 10, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontWeight: 700, fontSize: 15,
                  background: (highlight === 'front' && i === 0) || (highlight === 'rear' && i === queue.length - 1)
                    ? 'rgba(16,185,129,0.12)' : 'var(--surface2)',
                  border: `2px solid ${(highlight === 'front' && i === 0) || (highlight === 'rear' && i === queue.length - 1) ? 'var(--success)' : 'var(--border)'}`,
                  boxShadow: (highlight === 'front' && i === 0) ? '0 0 14px rgba(16,185,129,0.3)' : 'var(--shadow-sm)',
                  color: 'var(--text)',
                }}>{val}</div>
                <span style={{ fontSize: 9, color: 'var(--text3)' }}>
                  {i === 0 ? 'front' : i === queue.length - 1 ? 'rear' : ''}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
          {queue.length === 0 && <span style={{ color: 'var(--text3)', fontSize: 13 }}>Queue is empty</span>}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11, color: 'var(--text3)' }}>Size: {queue.length}</div>
      <ActionLog logs={logs} />
    </div>
  )
}
