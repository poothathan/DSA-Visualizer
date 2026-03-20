import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionLog from '../components/ActionLog'

function Arrow({ color = '#667eea', reverse = false }) {
  return (
    <svg width="36" height="20" viewBox="0 0 36 20" style={{ flexShrink: 0 }}>
      <defs>
        <marker id={`arr-${color.replace('#','')}`} markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L0,6 L6,3 z" fill={color} />
        </marker>
      </defs>
      {reverse && (
        <path d="M30,6 Q18,0 6,6" stroke="#34d399" strokeWidth="1.5" fill="none"
          markerEnd="url(#arr-34d399)" opacity="0.8" />
      )}
      <line x1="2" y1="13" x2="30" y2="13" stroke={color} strokeWidth="2"
        markerEnd={`url(#arr-${color.replace('#','')})`} />
    </svg>
  )
}

function NullArrow() {
  return (
    <svg width="36" height="20" viewBox="0 0 36 20" style={{ flexShrink: 0 }}>
      <line x1="2" y1="13" x2="26" y2="13" stroke="#475569" strokeWidth="2" />
      <line x1="26" y1="8" x2="34" y2="18" stroke="#475569" strokeWidth="2" />
      <line x1="26" y1="18" x2="34" y2="8" stroke="#475569" strokeWidth="2" />
    </svg>
  )
}

export default function LinkedListVisualizer({ type = 'singly', speed }) {
  const [list, setList] = useState([10, 20, 30, 40])
  const [input, setInput] = useState('')
  const [highlights, setHighlights] = useState({})
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — list initialized with [10, 20, 30, 40]' }])
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const insertHead = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Insert ${val} at head — O(1) operation`, 'info')
    setList(prev => [val, ...prev])
    setHighlights({ 0: 'found' }); await delay()
    setHighlights({})
    log(`Inserted ${val} at head successfully`, 'success')
    setRunning(false)
  }, [input, speed])

  const insertTail = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Insert ${val} at tail — traversing ${list.length} nodes`, 'info')
    for (let i = 0; i < list.length; i++) {
      setHighlights({ [i]: 'comparing' })
      log(`Traversing node ${i}: ${list[i]}`, 'step')
      await delay()
    }
    setList(prev => [...prev, val])
    setHighlights({ [list.length]: 'found' }); await delay()
    setHighlights({})
    log(`Inserted ${val} at tail (position ${list.length})`, 'success')
    setRunning(false)
  }, [input, list, speed])

  const deleteHead = useCallback(async () => {
    if (!list.length) { log('List is empty — nothing to delete', 'error'); return }
    setRunning(true)
    log(`Delete head — removing node ${list[0]}`, 'info')
    setHighlights({ 0: 'comparing' }); await delay()
    setHighlights({ 0: 'found' }); await delay()
    const removed = list[0]
    setList(prev => prev.slice(1)); setHighlights({})
    log(`Deleted head node: ${removed}`, 'success')
    setRunning(false)
  }, [list, speed])

  const search = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Linear search for ${val} — traversing list`, 'info')
    for (let i = 0; i < list.length; i++) {
      setHighlights({ [i]: 'comparing' })
      log(`Checking node ${i}: ${list[i]}${list[i] === val ? ' ← match!' : ''}`, list[i] === val ? 'success' : 'step')
      await delay()
      if (list[i] === val) {
        setHighlights({ [i]: 'found' })
        log(`Found ${val} at position ${i}`, 'success')
        setRunning(false); return
      }
    }
    setHighlights({})
    log(`${val} not found in list`, 'error')
    setRunning(false)
  }, [list, input, speed])

  const isDoubly = type === 'doubly'
  const isCircular = type === 'circular'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <button className="btn btn-primary btn-sm" onClick={insertHead} disabled={running}>Insert Head</button>
        <button className="btn btn-primary btn-sm" onClick={insertTail} disabled={running}>Insert Tail</button>
        <button className="btn btn-danger btn-sm" onClick={deleteHead} disabled={running}>Delete Head</button>
        <button className="btn btn-info btn-sm" onClick={search} disabled={running}>Search</button>
        <button className="btn btn-warning btn-sm" onClick={() => { setList([10,20,30,40]); setHighlights({}); setLogs([{ type: 'step', msg: 'Reset — list restored to [10, 20, 30, 40]' }]) }} disabled={running}>Reset</button>
      </div>
      <div className="viz-area" style={{ flexWrap: 'nowrap', gap: 0, overflowX: 'auto', justifyContent: 'center' }}>
        {/* HEAD label */}
        {list.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginRight: 4 }}>
            <span style={{ fontSize: 10, color: '#a78bfa', fontWeight: 700, marginBottom: 4 }}>HEAD</span>
            <svg width="24" height="20"><line x1="2" y1="13" x2="20" y2="13" stroke="#a78bfa" strokeWidth="2" markerEnd="url(#head-arr)" /><defs><marker id="head-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#a78bfa" /></marker></defs></svg>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {list.map((val, i) => (
            <motion.div key={`${i}-${val}`}
              initial={{ scale: 0, opacity: 0, x: -20 }} animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0, opacity: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className={`node-box ${highlights[i] || ''}`} style={{ width: 60, fontSize: 13 }}>
                  <span>{val}</span>
                  <span style={{ fontSize: 9, color: '#94a3b8', marginTop: 2 }}>
                    {isDoubly ? '⇄' : isCircular ? '↺' : '→'}
                  </span>
                </div>
              </div>
              {i < list.length - 1
                ? <Arrow color="#667eea" reverse={isDoubly} />
                : isCircular
                  ? <svg width="60" height="20" viewBox="0 0 60 20"><path d="M2,10 Q30,-10 58,10" stroke="#34d399" strokeWidth="1.5" fill="none" strokeDasharray="4,2" /><defs><marker id="circ-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L0,6 L6,3 z" fill="#34d399" /></marker></defs><line x1="50" y1="10" x2="58" y2="10" stroke="#34d399" strokeWidth="1.5" markerEnd="url(#circ-arr)" /></svg>
                  : <NullArrow />
              }
            </motion.div>
          ))}
        </AnimatePresence>
        {list.length === 0 && <span style={{ color: '#64748b', fontSize: 13 }}>Empty list</span>}
      </div>
      {isCircular && list.length > 0 && (
        <div style={{ fontSize: 11, color: 'var(--success)', textAlign: 'center' }}>↺ Tail → Head (circular)</div>
      )}
      <ActionLog logs={logs} />
    </div>
  )
}
