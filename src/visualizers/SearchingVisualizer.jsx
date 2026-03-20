import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionLog from '../components/ActionLog'

const INIT = [3, 8, 15, 22, 31, 45, 56, 67, 78, 90]

export default function SearchingVisualizer({ speed }) {
  const [arr, setArr] = useState([...INIT])
  const [input, setInput] = useState('')
  const [highlights, setHighlights] = useState({})
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — select algorithm and enter a value to search' }])
  const [algo, setAlgo] = useState('linear')
  const [running, setRunning] = useState(false)
  const [steps, setSteps] = useState(0)
  const [range, setRange] = useState({ low: -1, high: -1, mid: -1 })

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const linear = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true); setHighlights({}); setRange({ low: -1, high: -1, mid: -1 })
    let s = 0
    log(`Linear search for ${val} — checking each element`, 'info')
    for (let i = 0; i < arr.length; i++) {
      s++; setSteps(s)
      setHighlights({ [i]: 'comparing' })
      log(`Step ${s}: arr[${i}] = ${arr[i]}${arr[i] === val ? ' ← match!' : ''}`, arr[i] === val ? 'success' : 'step')
      await delay()
      if (arr[i] === val) {
        setHighlights({ [i]: 'found' })
        log(`Found ${val} at index ${i} in ${s} steps`, 'success')
        setRunning(false); return
      }
    }
    setHighlights({})
    log(`${val} not found — searched all ${s} elements`, 'error')
    setRunning(false)
  }, [arr, input, speed])

  const binary = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true); setHighlights({}); setSteps(0)
    let low = 0, high = arr.length - 1, s = 0
    log(`Binary search for ${val} — array must be sorted`, 'info')
    while (low <= high) {
      const mid = Math.floor((low + high) / 2)
      s++; setSteps(s); setRange({ low, high, mid })
      setHighlights({ [mid]: 'comparing' })
      log(`Step ${s}: low=${low} mid=${mid} high=${high} — arr[mid]=${arr[mid]}`, 'step')
      await delay()
      if (arr[mid] === val) {
        setHighlights({ [mid]: 'found' })
        log(`Found ${val} at index ${mid} in ${s} steps`, 'success')
        setRange({ low: -1, high: -1, mid: -1 }); setRunning(false); return
      }
      if (arr[mid] < val) { log(`${arr[mid]} < ${val} — search right half`, 'step'); low = mid + 1 }
      else { log(`${arr[mid]} > ${val} — search left half`, 'step'); high = mid - 1 }
    }
    setHighlights({}); setRange({ low: -1, high: -1, mid: -1 })
    log(`${val} not found — eliminated in ${s} steps`, 'error')
    setRunning(false)
  }, [arr, input, speed])

  const sort = () => setArr(prev => [...prev].sort((a, b) => a - b))

  const run = () => { algo === 'linear' ? linear() : binary() }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={running}>
          <option value="linear">Linear Search</option>
          <option value="binary">Binary Search</option>
        </select>
        <input type="number" placeholder="Search" value={input} onChange={e => setInput(e.target.value)} aria-label="Search value" />
        <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>Search</button>
        {algo === 'binary' && <button className="btn btn-teal btn-sm" onClick={sort} disabled={running}>Sort Array</button>}
        <button className="btn btn-warning btn-sm" onClick={() => { setArr([...INIT]); setHighlights({}); setSteps(0); setRange({ low: -1, high: -1, mid: -1 }); setLogs([{ type: 'step', msg: 'Reset — array restored' }]) }} disabled={running}>Reset</button>
      </div>
      {algo === 'binary' && (
        <div style={{ fontSize: 11, color: 'var(--warning)', padding: '4px 10px', background: 'rgba(245,158,11,0.08)', borderRadius: 6, border: '1px solid rgba(245,158,11,0.2)' }}>
          Binary search requires a sorted array. Click "Sort Array" first.
        </div>
      )}
      {steps > 0 && <div style={{ fontSize: 12, color: 'var(--text2)' }}>Steps taken: <strong>{steps}</strong></div>}
      <div className="viz-area" style={{ gap: 6, flexWrap: 'wrap' }}>
        <AnimatePresence>
          {arr.map((val, i) => {
            const isLow = range.low === i, isHigh = range.high === i, isMid = range.mid === i
            const hl = highlights[i]
            return (
              <motion.div key={i}
                animate={{ scale: hl === 'comparing' ? 1.1 : hl === 'found' ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
              >
                <div className={`node-box ${hl || ''}`} style={{
                  outline: isMid ? '2px solid #fbbf24' : isLow || isHigh ? '2px solid #60a5fa' : 'none',
                  outlineOffset: 2,
                }}>
                  {val}
                </div>
                <span style={{ fontSize: 9, color: isMid ? '#fbbf24' : isLow ? '#60a5fa' : isHigh ? '#60a5fa' : '#64748b' }}>
                  {isMid ? 'mid' : isLow ? 'low' : isHigh ? 'high' : `[${i}]`}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span><span style={{ color: 'var(--warning)' }}>■</span> Comparing</span>
        <span><span style={{ color: 'var(--success)' }}>■</span> Found</span>
        {algo === 'binary' && <>
          <span><span style={{ color: '#60a5fa' }}>■</span> Low/High</span>
          <span><span style={{ color: 'var(--warning)' }}>■</span> Mid</span>
        </>}
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
