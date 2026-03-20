import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionLog from '../components/ActionLog'

const nodeVariants = {
  enter: { scale: 0, opacity: 0, y: -20 },
  visible: { scale: 1, opacity: 1, y: 0 },
  exit: { scale: 0, opacity: 0 },
}

export default function ArrayVisualizer({ speed }) {
  const [arr, setArr] = useState([5, 12, 8, 3, 19, 7, 14])
  const [input, setInput] = useState('')
  const [idxInput, setIdxInput] = useState('')
  const [highlights, setHighlights] = useState({})
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — array initialized with 7 elements' }])
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const insert = useCallback(async () => {
    const val = parseInt(input)
    if (isNaN(val)) return
    setRunning(true)
    const idx = idxInput !== '' ? parseInt(idxInput) : arr.length
    const safeIdx = Math.max(0, Math.min(idx, arr.length))
    log(`Insert ${val} at index ${safeIdx} — shifting elements right`, 'info')
    for (let i = arr.length - 1; i >= safeIdx; i--) {
      setHighlights({ [i]: 'comparing' })
      log(`Shifting index ${i} → ${i + 1}`, 'step')
      await delay()
    }
    setArr(prev => { const a = [...prev]; a.splice(safeIdx, 0, val); return a })
    setHighlights({ [safeIdx]: 'found' })
    log(`Inserted ${val} at index ${safeIdx}`, 'success')
    await delay()
    setHighlights({})
    setRunning(false)
  }, [arr, input, idxInput, speed])

  const remove = useCallback(async () => {
    const idx = parseInt(idxInput)
    if (isNaN(idx) || idx < 0 || idx >= arr.length) { log('Invalid index', 'error'); return }
    setRunning(true)
    log(`Delete index ${idx} (value: ${arr[idx]}) — shifting elements left`, 'info')
    setHighlights({ [idx]: 'comparing' })
    await delay()
    setHighlights({ [idx]: 'found' })
    log(`Removing element ${arr[idx]} from index ${idx}`, 'warning')
    await delay()
    setArr(prev => prev.filter((_, i) => i !== idx))
    setHighlights({})
    log(`Deleted index ${idx} successfully`, 'success')
    setRunning(false)
  }, [arr, idxInput, speed])

  const search = useCallback(async () => {
    const val = parseInt(input)
    if (isNaN(val)) return
    setRunning(true)
    log(`Linear search for value ${val}`, 'info')
    for (let i = 0; i < arr.length; i++) {
      setHighlights({ [i]: 'comparing' })
      log(`Checking index ${i}: arr[${i}] = ${arr[i]}${arr[i] === val ? ' ← match!' : ''}`, arr[i] === val ? 'success' : 'step')
      await delay()
      if (arr[i] === val) {
        setHighlights({ [i]: 'found' })
        log(`Found ${val} at index ${i}`, 'success')
        setRunning(false)
        return
      }
    }
    setHighlights({})
    log(`${val} not found in array`, 'error')
    setRunning(false)
  }, [arr, input, speed])

  const reset = () => {
    setArr([5, 12, 8, 3, 19, 7, 14])
    setHighlights({})
    setLogs([{ type: 'step', msg: 'Reset — array restored to default' }])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <input type="number" placeholder="Index" value={idxInput} onChange={e => setIdxInput(e.target.value)} aria-label="Index" style={{ width: 70 }} />
        <button className="btn btn-primary btn-sm" onClick={insert} disabled={running}>Insert</button>
        <button className="btn btn-danger btn-sm" onClick={remove} disabled={running}>Delete</button>
        <button className="btn btn-info btn-sm" onClick={search} disabled={running}>Search</button>
        <button className="btn btn-warning btn-sm" onClick={reset} disabled={running}>Reset</button>
      </div>
      <div className="viz-area" style={{ gap: 8, flexWrap: 'wrap' }}>
        <AnimatePresence mode="popLayout">
          {arr.map((val, i) => (
            <motion.div key={`${i}-${val}`} variants={nodeVariants}
              initial="enter" animate="visible" exit="exit"
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <div className={`node-box ${highlights[i] || ''}`}>{val}</div>
              <span style={{ fontSize: 10, color: 'var(--text3)' }}>[{i}]</span>
            </motion.div>
          ))}
        </AnimatePresence>
        {arr.length === 0 && <span style={{ color: 'var(--text3)', fontSize: 13 }}>Empty array</span>}
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
