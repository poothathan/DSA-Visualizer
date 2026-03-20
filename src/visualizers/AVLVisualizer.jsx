import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import ActionLog from '../components/ActionLog'

class AVLNode {
  constructor(val) { this.val = val; this.left = null; this.right = null; this.h = 1 }
}

const h = n => n ? n.h : 0
const bf = n => n ? h(n.left) - h(n.right) : 0
const upH = n => { if (n) n.h = 1 + Math.max(h(n.left), h(n.right)) }

function rotR(y) {
  const x = y.left, T2 = x.right
  x.right = y; y.left = T2
  upH(y); upH(x); return x
}
function rotL(x) {
  const y = x.right, T2 = y.left
  y.left = x; x.right = T2
  upH(x); upH(y); return y
}

function insert(node, val) {
  if (!node) return new AVLNode(val)
  if (val < node.val) node.left = insert(node.left, val)
  else if (val > node.val) node.right = insert(node.right, val)
  else return node
  upH(node)
  const b = bf(node)
  if (b > 1 && val < node.left.val) return rotR(node)
  if (b < -1 && val > node.right.val) return rotL(node)
  if (b > 1 && val > node.left.val) { node.left = rotL(node.left); return rotR(node) }
  if (b < -1 && val < node.right.val) { node.right = rotR(node.right); return rotL(node) }
  return node
}

function minNode(n) { let c = n; while (c.left) c = c.left; return c }

function remove(node, val) {
  if (!node) return null
  if (val < node.val) node.left = remove(node.left, val)
  else if (val > node.val) node.right = remove(node.right, val)
  else {
    if (!node.left || !node.right) return node.left || node.right
    const m = minNode(node.right)
    node.val = m.val; node.right = remove(node.right, m.val)
  }
  upH(node)
  const b = bf(node)
  if (b > 1 && bf(node.left) >= 0) return rotR(node)
  if (b > 1 && bf(node.left) < 0) { node.left = rotL(node.left); return rotR(node) }
  if (b < -1 && bf(node.right) <= 0) return rotL(node)
  if (b < -1 && bf(node.right) > 0) { node.right = rotR(node.right); return rotL(node) }
  return node
}

function buildLayout(node, x, y, gap) {
  if (!node) return { nodes: [], edges: [] }
  const nodes = [{ val: node.val, x, y, bf: bf(node) }]
  const edges = []
  if (node.left) {
    edges.push({ x1: x, y1: y, x2: x - gap, y2: y + 70 })
    const l = buildLayout(node.left, x - gap, y + 70, gap / 2)
    nodes.push(...l.nodes); edges.push(...l.edges)
  }
  if (node.right) {
    edges.push({ x1: x, y1: y, x2: x + gap, y2: y + 70 })
    const r = buildLayout(node.right, x + gap, y + 70, gap / 2)
    nodes.push(...r.nodes); edges.push(...r.edges)
  }
  return { nodes, edges }
}

function buildInitial() {
  let r = null
  for (const v of [30, 20, 40, 10, 25, 35, 50]) r = insert(r, v)
  return r
}

export default function AVLVisualizer({ speed }) {
  const [root, setRoot] = useState(buildInitial)
  const [input, setInput] = useState('')
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — AVL tree auto-balances on every insert/delete' }])
  const [highlights, setHighlights] = useState({})
  const [running, setRunning] = useState(false)

  const delay = () => new Promise(r => setTimeout(r, speed))
  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const doInsert = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Insert ${val} — AVL will rebalance if needed`, 'info')
    setHighlights({ [val]: 'comparing' }); await delay()
    setRoot(prev => insert(prev, val))
    setHighlights({ [val]: 'found' }); await delay()
    setHighlights({})
    log(`Inserted ${val} — tree is balanced`, 'success')
    setRunning(false)
  }, [input, speed])

  const doDelete = useCallback(async () => {
    const val = parseInt(input); if (isNaN(val)) return
    setRunning(true)
    log(`Delete ${val} — AVL will rebalance after removal`, 'info')
    setHighlights({ [val]: 'comparing' }); await delay()
    setRoot(prev => remove(prev, val))
    setHighlights({})
    log(`Deleted ${val} — tree rebalanced`, 'success')
    setRunning(false)
  }, [input, speed])

  const W = 560, H = 300
  const { nodes, edges } = root ? buildLayout(root, 280, 30, 120) : { nodes: [], edges: [] }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <input type="number" placeholder="Value" value={input} onChange={e => setInput(e.target.value)} aria-label="Value" />
        <button className="btn btn-primary btn-sm" onClick={doInsert} disabled={running}>Insert</button>
        <button className="btn btn-danger btn-sm" onClick={doDelete} disabled={running}>Delete</button>
        <button className="btn btn-warning btn-sm" onClick={() => { setRoot(buildInitial()); setHighlights({}); setLogs([{ type: 'step', msg: 'Reset — AVL tree restored' }]) }} disabled={running}>Reset</button>
      </div>
      <div className="viz-area" style={{ overflow: 'auto' }}>
        <svg width={W} height={H} style={{ minWidth: W, display: 'block' }}>
          {edges.map((e, i) => (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke="rgba(7,200,249,0.4)" strokeWidth="2" />
          ))}
          {nodes.map(n => {
            const bfColor = n.bf === 0 ? '#10b981' : Math.abs(n.bf) === 1 ? '#f59e0b' : '#ef4444'
            return (
              <motion.g key={n.val} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 30 }}>
                <circle cx={n.x} cy={n.y} r={22}
                  fill={highlights[n.val] === 'found' ? 'rgba(16,185,129,0.6)' : highlights[n.val] === 'comparing' ? 'rgba(245,158,11,0.6)' : 'rgba(7,200,249,0.35)'}
                  stroke={highlights[n.val] ? (highlights[n.val] === 'found' ? '#10b981' : '#f59e0b') : 'rgba(7,200,249,0.6)'}
                  strokeWidth="2"
                />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#0f172a" fontSize="12" fontWeight="700">{n.val}</text>
                <text x={n.x} y={n.y - 28} textAnchor="middle" fill={bfColor} fontSize="10">bf={n.bf}</text>
              </motion.g>
            )
          })}
        </svg>
      </div>
      <div style={{ fontSize: 11, color: 'var(--text2)', textAlign: 'center' }}>
        <span style={{ color: 'var(--success)' }}>■</span> bf=0 &nbsp;
        <span style={{ color: 'var(--warning)' }}>■</span> bf=±1 &nbsp;
        <span style={{ color: 'var(--danger)' }}>■</span> bf=±2 (triggers rotation)
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
