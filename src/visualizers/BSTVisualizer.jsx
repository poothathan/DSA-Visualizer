import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import ActionLog from '../components/ActionLog'

class BSTNode {
  constructor(val) { this.val = val; this.left = null; this.right = null }
}

function insertBST(root, val) {
  if (!root) return new BSTNode(val)
  if (val < root.val) root.left = insertBST(root.left, val)
  else if (val > root.val) root.right = insertBST(root.right, val)
  return root
}

function deleteBST(root, val) {
  if (!root) return null
  if (val < root.val) { root.left = deleteBST(root.left, val); return root }
  if (val > root.val) { root.right = deleteBST(root.right, val); return root }
  if (!root.left) return root.right
  if (!root.right) return root.left
  let min = root.right
  while (min.left) min = min.left
  root.val = min.val
  root.right = deleteBST(root.right, min.val)
  return root
}

function cloneTree(node) {
  if (!node) return null
  const n = new BSTNode(node.val)
  n.left = cloneTree(node.left); n.right = cloneTree(node.right)
  return n
}

function buildLayout(node, x, y, gap) {
  if (!node) return []
  const nodes = [{ val: node.val, x, y }]
  if (node.left) nodes.push(...buildLayout(node.left, x - gap, y + 70, gap / 2))
  if (node.right) nodes.push(...buildLayout(node.right, x + gap, y + 70, gap / 2))
  return nodes
}

function buildEdges(node, x, y, gap) {
  if (!node) return []
  const edges = []
  if (node.left) {
    edges.push({ x1: x, y1: y, x2: x - gap, y2: y + 70 })
    edges.push(...buildEdges(node.left, x - gap, y + 70, gap / 2))
  }
  if (node.right) {
    edges.push({ x1: x, y1: y, x2: x + gap, y2: y + 70 })
    edges.push(...buildEdges(node.right, x + gap, y + 70, gap / 2))
  }
  return edges
}

function buildInitialTree() {
  let root = null
  for (const v of [50, 30, 70, 20, 40, 60, 80]) root = insertBST(root, v)
  return root
}

export default function BSTVisualizer({ speed }) {
  const [root, setRoot] = useState(buildInitialTree)
  const [input, setInput] = useState('')
  const [highlights, setHighlights] = useState({})
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — BST initialized with [50,30,70,20,40,60,80]' }])
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const insert = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Insert ${val} — traversing BST to find position`, 'info')
    let cur = root; const path = []
    while (cur) {
      path.push(cur.val)
      if (val < cur.val) cur = cur.left
      else if (val > cur.val) cur = cur.right
      else break
    }
    for (const v of path) {
      setHighlights({ [v]: 'comparing' })
      log(`Compare ${val} with node ${v} — go ${val < v ? 'left' : 'right'}`, 'step')
      await delay()
    }
    setRoot(prev => { const r = cloneTree(prev); return insertBST(r, val) })
    setHighlights({ [val]: 'found' }); await delay()
    setHighlights({})
    log(`Inserted ${val} after traversing ${path.length} nodes`, 'success')
    setRunning(false)
  }, [root, input, speed])

  const search = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Search for ${val} in BST`, 'info')
    let cur = root
    while (cur) {
      setHighlights({ [cur.val]: 'comparing' })
      log(`Compare ${val} with node ${cur.val}${cur.val === val ? ' ← match!' : val < cur.val ? ' — go left' : ' — go right'}`, cur.val === val ? 'success' : 'step')
      await delay()
      if (cur.val === val) {
        setHighlights({ [cur.val]: 'found' })
        log(`Found ${val} in BST`, 'success')
        setRunning(false); return
      }
      cur = val < cur.val ? cur.left : cur.right
    }
    setHighlights({})
    log(`${val} not found in BST`, 'error')
    setRunning(false)
  }, [root, input, speed])

  const remove = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Delete ${val} from BST`, 'info')
    setHighlights({ [val]: 'comparing' }); await delay()
    setRoot(prev => { const r = cloneTree(prev); return deleteBST(r, val) })
    setHighlights({})
    log(`Deleted ${val} and restructured BST`, 'success')
    setRunning(false)
  }, [root, input, speed])

  const W = 560, H = 300, cx = 280
  const nodes = root ? buildLayout(root, cx, 30, 120) : []
  const edges = root ? buildEdges(root, cx, 30, 120) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <button className="btn btn-primary btn-sm" onClick={insert} disabled={running}>Insert</button>
        <button className="btn btn-info btn-sm" onClick={search} disabled={running}>Search</button>
        <button className="btn btn-danger btn-sm" onClick={remove} disabled={running}>Delete</button>
        <button className="btn btn-warning btn-sm" onClick={() => { setRoot(buildInitialTree()); setHighlights({}); setLogs([{ type: 'step', msg: 'Reset — BST restored to default' }]) }} disabled={running}>Reset</button>
      </div>
      <div className="viz-area" style={{ overflow: 'auto' }}>
        <svg width={W} height={H} style={{ minWidth: W, display: 'block' }}>
          {edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="rgba(7,200,249,0.4)" strokeWidth="2" />
          ))}
          {nodes.map(n => (
            <motion.g key={n.val} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
              <circle cx={n.x} cy={n.y} r={22}
                fill={highlights[n.val] === 'found' ? 'rgba(16,185,129,0.6)' : highlights[n.val] === 'comparing' ? 'rgba(245,158,11,0.6)' : 'rgba(7,200,249,0.35)'}
                stroke={highlights[n.val] === 'found' ? '#10b981' : highlights[n.val] === 'comparing' ? '#f59e0b' : 'rgba(7,200,249,0.6)'}
                strokeWidth="2"
                style={{ filter: highlights[n.val] ? `drop-shadow(0 0 8px ${highlights[n.val] === 'found' ? '#10b981' : '#f59e0b'})` : 'none' }}
              />
              <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="700">{n.val}</text>
            </motion.g>
          ))}
          {nodes.length === 0 && <text x={W/2} y={H/2} textAnchor="middle" fill="var(--text3)" fontSize="14">Empty tree</text>}
        </svg>
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
