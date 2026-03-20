import { useState, useCallback, useRef } from 'react'
import { motion } from 'framer-motion'
import ActionLog from '../components/ActionLog'

const INIT = [64, 34, 25, 12, 22, 11, 90, 45, 67, 38]
function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

export default function SortingVisualizer({ speed }) {
  const [arr, setArr] = useState([...INIT])
  const [highlights, setHighlights] = useState({})
  const [sorted, setSorted] = useState({})
  const [algo, setAlgo] = useState('bubble')
  const [running, setRunning] = useState(false)
  const [comparisons, setComparisons] = useState(0)
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — select an algorithm and click Sort' }])
  const stopRef = useRef(false)

  const delay = () => sleep(speed)
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const reset = () => {
    stopRef.current = true
    setTimeout(() => {
      setArr([...INIT]); setHighlights({}); setSorted({}); setComparisons(0); setRunning(false)
      setLogs([{ type: 'step', msg: 'Reset — array restored to default' }])
    }, 50)
  }

  const randomize = () => {
    stopRef.current = true
    setTimeout(() => {
      const a = Array.from({ length: 10 }, () => Math.floor(Math.random() * 90) + 10)
      setArr(a); setHighlights({}); setSorted({}); setComparisons(0); setRunning(false)
      setLogs([{ type: 'step', msg: `Randomized — new array: [${a.join(', ')}]` }])
    }, 50)
  }

  const bubble = useCallback(async () => {
    setRunning(true); stopRef.current = false
    const a = [...arr]; let comps = 0
    log(`Starting Bubble Sort on [${a.join(', ')}]`, 'info')
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = 0; j < a.length - i - 1; j++) {
        if (stopRef.current) return
        setHighlights({ [j]: true, [j + 1]: true }); comps++; setComparisons(comps)
        log(`Compare a[${j}]=${a[j]} and a[${j+1}]=${a[j+1]}${a[j] > a[j+1] ? ' → swap' : ' → no swap'}`, 'step')
        await delay()
        if (a[j] > a[j + 1]) { [a[j], a[j + 1]] = [a[j + 1], a[j]]; setArr([...a]) }
        await delay()
      }
      setSorted(prev => ({ ...prev, [a.length - 1 - i]: true }))
      log(`Pass ${i+1} complete — element ${a[a.length-1-i]} is in final position`, 'warning')
    }
    setSorted(Object.fromEntries(a.map((_, i) => [i, true])))
    setHighlights({})
    log(`Bubble Sort complete — ${comps} comparisons`, 'success')
    setRunning(false)
  }, [arr, speed])

  const selection = useCallback(async () => {
    setRunning(true); stopRef.current = false
    const a = [...arr]; let comps = 0
    log(`Starting Selection Sort on [${a.join(', ')}]`, 'info')
    for (let i = 0; i < a.length - 1; i++) {
      let minIdx = i
      log(`Pass ${i+1} — finding minimum from index ${i}`, 'info')
      for (let j = i + 1; j < a.length; j++) {
        if (stopRef.current) return
        setHighlights({ [minIdx]: true, [j]: true }); comps++; setComparisons(comps)
        if (a[j] < a[minIdx]) { minIdx = j; log(`New min found: ${a[j]} at index ${j}`, 'step') }
        else log(`a[${j}]=${a[j]} >= current min ${a[minIdx]}`, 'step')
        await delay()
      }
      if (minIdx !== i) { [a[i], a[minIdx]] = [a[minIdx], a[i]]; setArr([...a]); log(`Swap a[${i}]=${a[minIdx]} with a[${minIdx}]=${a[i]}`, 'warning') }
      setSorted(prev => ({ ...prev, [i]: true }))
    }
    setSorted(Object.fromEntries(a.map((_, i) => [i, true])))
    setHighlights({})
    log(`Selection Sort complete — ${comps} comparisons`, 'success')
    setRunning(false)
  }, [arr, speed])

  const insertion = useCallback(async () => {
    setRunning(true); stopRef.current = false
    const a = [...arr]; let comps = 0
    log(`Starting Insertion Sort on [${a.join(', ')}]`, 'info')
    for (let i = 1; i < a.length; i++) {
      const key = a[i]; let j = i - 1
      log(`Insert key=${key} into sorted portion [0..${i-1}]`, 'info')
      setHighlights({ [i]: true })
      while (j >= 0 && a[j] > key) {
        if (stopRef.current) return
        comps++; setComparisons(comps)
        a[j + 1] = a[j]; setArr([...a])
        setHighlights({ [j]: true, [j + 1]: true })
        log(`a[${j}]=${a[j]} > ${key} — shift right`, 'step')
        await delay(); j--
      }
      a[j + 1] = key; setArr([...a])
      log(`Placed ${key} at index ${j+1}`, 'warning')
      setSorted(prev => { const n = { ...prev }; for (let k = 0; k <= i; k++) n[k] = true; return n })
      await delay()
    }
    setHighlights({})
    log(`Insertion Sort complete — ${comps} comparisons`, 'success')
    setRunning(false)
  }, [arr, speed])

  const merge = useCallback(async () => {
    setRunning(true); stopRef.current = false
    const a = [...arr]; let comps = 0
    log(`Starting Merge Sort on [${a.join(', ')}]`, 'info')
    const mergeArr = async (arr, l, r) => {
      if (l >= r) return
      const m = Math.floor((l + r) / 2)
      log(`Divide [${l}..${r}] → [${l}..${m}] and [${m+1}..${r}]`, 'step')
      await mergeArr(arr, l, m)
      await mergeArr(arr, m + 1, r)
      const left = arr.slice(l, m + 1), right = arr.slice(m + 1, r + 1)
      let i = 0, j = 0, k = l
      log(`Merging [${l}..${m}] and [${m+1}..${r}]`, 'info')
      while (i < left.length && j < right.length) {
        if (stopRef.current) return
        comps++; setComparisons(comps)
        setHighlights({ [k]: true })
        log(`${left[i]} vs ${right[j]} → pick ${left[i] <= right[j] ? left[i] : right[j]}`, 'step')
        if (left[i] <= right[j]) { arr[k++] = left[i++] } else { arr[k++] = right[j++] }
        setArr([...arr]); await delay()
      }
      while (i < left.length) { arr[k++] = left[i++]; setArr([...arr]); await delay() }
      while (j < right.length) { arr[k++] = right[j++]; setArr([...arr]); await delay() }
    }
    await mergeArr(a, 0, a.length - 1)
    setSorted(Object.fromEntries(a.map((_, i) => [i, true])))
    setHighlights({})
    log(`Merge Sort complete — ${comps} comparisons`, 'success')
    setRunning(false)
  }, [arr, speed])

  const quick = useCallback(async () => {
    setRunning(true); stopRef.current = false
    const a = [...arr]; let comps = 0
    log(`Starting Quick Sort on [${a.join(', ')}]`, 'info')
    const partition = async (arr, low, high) => {
      const pivot = arr[high]; let i = low - 1
      log(`Partition [${low}..${high}] — pivot = ${pivot}`, 'info')
      for (let j = low; j < high; j++) {
        if (stopRef.current) return i
        comps++; setComparisons(comps)
        setHighlights({ [j]: true, [high]: true })
        log(`a[${j}]=${arr[j]} vs pivot=${pivot}${arr[j] < pivot ? ' → move left' : ' → stay'}`, 'step')
        await delay()
        if (arr[j] < pivot) { i++; [arr[i], arr[j]] = [arr[j], arr[i]]; setArr([...arr]); log(`Swap a[${i}] and a[${j}]`, 'warning'); await delay() }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]; setArr([...arr]); await delay()
      log(`Pivot ${pivot} placed at index ${i+1}`, 'success')
      return i + 1
    }
    const qsort = async (arr, low, high) => {
      if (low < high) {
        const pi = await partition(arr, low, high)
        setSorted(prev => ({ ...prev, [pi]: true }))
        await qsort(arr, low, pi - 1)
        await qsort(arr, pi + 1, high)
      }
    }
    await qsort(a, 0, a.length - 1)
    setSorted(Object.fromEntries(a.map((_, i) => [i, true])))
    setHighlights({})
    log(`Quick Sort complete — ${comps} comparisons`, 'success')
    setRunning(false)
  }, [arr, speed])

  const run = () => ({ bubble, selection, insertion, merge, quick })[algo]?.()
  const maxVal = Math.max(...arr, 1)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <select value={algo} onChange={e => setAlgo(e.target.value)} disabled={running}>
          <option value="bubble">Bubble Sort</option>
          <option value="selection">Selection Sort</option>
          <option value="insertion">Insertion Sort</option>
          <option value="merge">Merge Sort</option>
          <option value="quick">Quick Sort</option>
        </select>
        <button className="btn btn-primary btn-sm" onClick={run} disabled={running}>Sort</button>
        <button className="btn btn-teal btn-sm" onClick={randomize} disabled={running}>Randomize</button>
        <button className="btn btn-warning btn-sm" onClick={reset}>Reset</button>
        {comparisons > 0 && (
          <span style={{ fontSize: 12, color: 'var(--text2)', marginLeft: 4 }}>
            Comparisons: <strong>{comparisons}</strong>
          </span>
        )}
      </div>
      <div className="viz-area" style={{ alignItems: 'flex-end', gap: 3, height: 220, overflowX: 'auto', justifyContent: 'center', padding: '12px 8px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 3, height: '100%', minWidth: 'min-content' }}>
        {arr.map((val, i) => (
          <motion.div key={i}
            animate={{ height: `${(val / maxVal) * 180}px`, scaleY: highlights[i] ? 1.05 : 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{
              width: `${Math.max(20, Math.floor(400 / arr.length) - 4)}px`,
              borderRadius: '4px 4px 0 0',
              background: sorted[i]
                ? 'linear-gradient(180deg,var(--success),#059669)'
                : highlights[i]
                  ? 'linear-gradient(180deg,var(--warning),#d97706)'
                  : 'linear-gradient(180deg,var(--primary),var(--primary-dark))',
              display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
              paddingTop: 4, fontSize: 10, color: '#fff', fontWeight: 600,
              minHeight: 4,
            }}
          >
            {val}
          </motion.div>
        ))}
        </div>
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
