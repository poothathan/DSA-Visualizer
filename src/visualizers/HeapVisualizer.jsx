import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ActionLog from '../components/ActionLog'

function parentIdx(i) { return Math.floor((i - 1) / 2) }
function leftIdx(i) { return 2 * i + 1 }
function rightIdx(i) { return 2 * i + 2 }

function siftUp(arr, i, isMax) {
  const steps = []
  while (i > 0) {
    const p = parentIdx(i)
    const cond = isMax ? arr[i] > arr[p] : arr[i] < arr[p]
    if (cond) {
      steps.push({ type: 'swap', a: i, b: p });
      [arr[i], arr[p]] = [arr[p], arr[i]]; i = p
    } else break
  }
  return steps
}

function siftDown(arr, i, n, isMax) {
  const steps = []
  while (true) {
    let target = i, l = leftIdx(i), r = rightIdx(i)
    if (l < n && (isMax ? arr[l] > arr[target] : arr[l] < arr[target])) target = l
    if (r < n && (isMax ? arr[r] > arr[target] : arr[r] < arr[target])) target = r
    if (target !== i) {
      steps.push({ type: 'swap', a: i, b: target });
      [arr[i], arr[target]] = [arr[target], arr[i]]; i = target
    } else break
  }
  return steps
}

export default function HeapVisualizer({ speed }) {
  const [heap, setHeap] = useState([90, 75, 80, 55, 60, 65, 70])
  const [isMax, setIsMax] = useState(true)
  const [input, setInput] = useState('')
  const [highlights, setHighlights] = useState({})
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — Max Heap initialized' }])
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const insertVal = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    const arr = [...heap, val]
    setHeap(arr)
    log(`Insert ${val} at index ${arr.length - 1} — sifting up`, 'info')
    const steps = siftUp([...arr], arr.length - 1, isMax)
    const cur = [...arr]
    for (const s of steps) {
      setHighlights({ [s.a]: 'comparing', [s.b]: 'comparing' })
      log(`Swap index ${s.a} (${cur[s.a]}) with parent index ${s.b} (${cur[s.b]})`, 'warning')
      await delay();
      [cur[s.a], cur[s.b]] = [cur[s.b], cur[s.a]]
      setHeap([...cur]); await delay()
    }
    setHighlights({})
    log(`Inserted ${val} — heap property maintained`, 'success')
    setRunning(false)
  }, [heap, input, isMax, speed])

  const extractRoot = useCallback(async () => {
    if (!heap.length) return
    setRunning(true)
    const root = heap[0]
    log(`Extract ${isMax ? 'max' : 'min'} = ${root} — move last element to root`, 'info')
    setHighlights({ 0: 'comparing' }); await delay()
    const arr = [...heap]
    arr[0] = arr[arr.length - 1]; arr.pop()
    setHeap([...arr])
    log(`Root replaced with ${arr[0]} — sifting down`, 'step')
    const steps = siftDown([...arr], 0, arr.length, isMax)
    const cur = [...arr]
    for (const s of steps) {
      setHighlights({ [s.a]: 'comparing', [s.b]: 'comparing' })
      log(`Swap index ${s.a} (${cur[s.a]}) with child index ${s.b} (${cur[s.b]})`, 'warning')
      await delay();
      [cur[s.a], cur[s.b]] = [cur[s.b], cur[s.a]]
      setHeap([...cur]); await delay()
    }
    setHighlights({})
    log(`Extracted ${root} — heap property restored`, 'success')
    setRunning(false)
  }, [heap, isMax, speed])

  const buildHeap = useCallback(async () => {
    setRunning(true)
    log(`Build ${isMax ? 'Max' : 'Min'} Heap — heapify from last non-leaf`, 'info')
    const arr = [...heap]
    for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
      setHighlights({ [i]: 'comparing' })
      log(`Heapify subtree rooted at index ${i} (value ${arr[i]})`, 'step')
      await delay()
      const steps = siftDown([...arr], i, arr.length, isMax)
      for (const s of steps) {
        [arr[s.a], arr[s.b]] = [arr[s.b], arr[s.a]]
        setHeap([...arr]); await delay()
      }
    }
    setHighlights({})
    log(`${isMax ? 'Max' : 'Min'} Heap built successfully`, 'success')
    setRunning(false)
  }, [heap, isMax, speed])

  const W = 560, H = 260
  function nodePos(i) {
    const level = Math.floor(Math.log2(i + 1))
    const posInLevel = i - (Math.pow(2, level) - 1)
    const totalInLevel = Math.pow(2, level)
    const x = (W / (totalInLevel + 1)) * (posInLevel + 1)
    const y = 30 + level * 65
    return { x, y }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <select value={isMax ? 'max' : 'min'} onChange={e => setIsMax(e.target.value === 'max')} disabled={running}>
          <option value="max">Max Heap</option>
          <option value="min">Min Heap</option>
        </select>
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <button className="btn btn-primary btn-sm" onClick={insertVal} disabled={running}>Insert</button>
        <button className="btn btn-danger btn-sm" onClick={extractRoot} disabled={running}>Extract {isMax ? 'Max' : 'Min'}</button>
        <button className="btn btn-teal btn-sm" onClick={buildHeap} disabled={running}>Build Heap</button>
        <button className="btn btn-warning btn-sm" onClick={() => { setHeap([90,75,80,55,60,65,70]); setHighlights({}); setLogs([{ type: 'step', msg: 'Reset — heap restored to default' }]) }} disabled={running}>Reset</button>
      </div>
      <div className="viz-area" style={{ overflow: 'auto' }}>
        <svg width={W} height={H} style={{ minWidth: W, display: 'block' }}>
          {heap.map((_, i) => {
            const l = leftIdx(i), r = rightIdx(i)
            const { x, y } = nodePos(i)
            return (
              <g key={`e-${i}`}>
                {l < heap.length && (() => { const p = nodePos(l); return <line x1={x} y1={y} x2={p.x} y2={p.y} stroke="rgba(7,200,249,0.4)" strokeWidth="2" /> })()}
                {r < heap.length && (() => { const p = nodePos(r); return <line x1={x} y1={y} x2={p.x} y2={p.y} stroke="rgba(7,200,249,0.4)" strokeWidth="2" /> })()}
              </g>
            )
          })}
          <AnimatePresence>
            {heap.map((val, i) => {
              const { x, y } = nodePos(i)
              const isHL = highlights[i]
              return (
                <motion.g key={`n-${i}-${val}`} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                  <circle cx={x} cy={y} r={22}
                    fill={isHL === 'found' ? 'rgba(16,185,129,0.6)' : isHL === 'comparing' ? 'rgba(245,158,11,0.6)' : i === 0 ? 'rgba(7,200,249,0.55)' : 'rgba(7,200,249,0.3)'}
                    stroke={isHL ? (isHL === 'found' ? '#10b981' : '#f59e0b') : i === 0 ? '#07c8f9' : 'rgba(7,200,249,0.5)'}
                    strokeWidth="2"
                    style={{ filter: isHL ? `drop-shadow(0 0 8px ${isHL === 'found' ? '#10b981' : '#f59e0b'})` : 'none' }}
                  />
                  <text x={x} y={y + 5} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">{val}</text>
                  <text x={x} y={y + 36} textAnchor="middle" fill="#64748b" fontSize="9">[{i}]</text>
                </motion.g>
              )
            })}
          </AnimatePresence>
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center' }}>
        {heap.map((v, i) => (
          <div key={i} style={{ padding: '3px 8px', borderRadius: 6, background: 'var(--primary-light)', fontSize: 12, color: 'var(--primary-dark)' }}>
            [{i}]={v}
          </div>
        ))}
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
