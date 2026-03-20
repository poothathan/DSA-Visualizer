import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import ActionLog from '../components/ActionLog'

const INIT_NODES = [
  { id: 0, label: 'A', x: 100, y: 80 },
  { id: 1, label: 'B', x: 250, y: 40 },
  { id: 2, label: 'C', x: 380, y: 100 },
  { id: 3, label: 'D', x: 200, y: 180 },
  { id: 4, label: 'E', x: 340, y: 220 },
]
const INIT_EDGES = [
  { from: 0, to: 1 }, { from: 0, to: 3 },
  { from: 1, to: 2 }, { from: 1, to: 3 },
  { from: 2, to: 4 }, { from: 3, to: 4 },
]

export default function GraphVisualizer({ speed }) {
  const [nodes] = useState(INIT_NODES)
  const [edges] = useState(INIT_EDGES)
  const [directed, setDirected] = useState(false)
  const [visited, setVisited] = useState({})
  const [queue, setQueue] = useState([])
  const [logs, setLogs] = useState([{ type: 'step', msg: 'Ready — select start node and click BFS or DFS' }])
  const [running, setRunning] = useState(false)
  const [startNode, setStartNode] = useState(0)
  const [activeEdges, setActiveEdges] = useState({})

  const delay = () => new Promise(r => setTimeout(r, speed))

  const log = (msg, type = 'step') => setLogs(prev => [...prev, { msg, type }])

  const getAdj = useCallback((id) => {
    const adj = []
    for (const e of edges) {
      if (e.from === id) adj.push(e.to)
      if (!directed && e.to === id) adj.push(e.from)
    }
    return adj
  }, [edges, directed])

  const bfs = useCallback(async () => {
    setRunning(true); setVisited({}); setActiveEdges({})
    const vis = {}; const q = [startNode]
    vis[startNode] = true; setVisited({ ...vis })
    log(`BFS from node ${nodes[startNode].label} — using queue`, 'info')
    while (q.length) {
      const cur = q.shift()
      setQueue([...q])
      setVisited(prev => ({ ...prev, [cur]: 'current' }))
      log(`Visiting node ${nodes[cur].label}`, 'step')
      await delay()
      setVisited(prev => ({ ...prev, [cur]: 'visited' }))
      for (const nb of getAdj(cur)) {
        if (!vis[nb]) {
          vis[nb] = true
          setActiveEdges(prev => ({ ...prev, [`${cur}-${nb}`]: true, [`${nb}-${cur}`]: true }))
          q.push(nb); setQueue([...q])
          setVisited(prev => ({ ...prev, [nb]: 'queued' }))
          log(`Enqueue ${nodes[nb].label} (neighbor of ${nodes[cur].label})`, 'warning')
          await delay()
        }
      }
    }
    log('BFS complete — all reachable nodes visited', 'success')
    setRunning(false)
  }, [startNode, nodes, getAdj, speed])

  const dfs = useCallback(async () => {
    setRunning(true); setVisited({}); setActiveEdges({})
    const vis = {}
    log(`DFS from node ${nodes[startNode].label} — using stack`, 'info')
    const stack = [startNode]
    while (stack.length) {
      const cur = stack.pop()
      if (vis[cur]) continue
      vis[cur] = true
      setVisited({ ...vis, [cur]: 'current' })
      log(`Visiting node ${nodes[cur].label}`, 'step')
      await delay()
      setVisited({ ...vis })
      for (const nb of getAdj(cur)) {
        if (!vis[nb]) {
          setActiveEdges(prev => ({ ...prev, [`${cur}-${nb}`]: true }))
          log(`Push ${nodes[nb].label} onto stack (neighbor of ${nodes[cur].label})`, 'warning')
          stack.push(nb)
        }
      }
    }
    log('DFS complete — all reachable nodes visited', 'success')
    setRunning(false)
  }, [startNode, nodes, getAdj, speed])

  const W = 480, H = 280

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="controls-row">
        <select value={startNode} onChange={e => setStartNode(+e.target.value)} disabled={running}>
          {nodes.map(n => <option key={n.id} value={n.id}>Start: {n.label}</option>)}
        </select>
        <button className="btn btn-secondary btn-sm" onClick={() => setDirected(d => !d)} disabled={running}>
          {directed ? 'Directed' : 'Undirected'}
        </button>
        <button className="btn btn-primary btn-sm" onClick={bfs} disabled={running}>BFS</button>
        <button className="btn btn-info btn-sm" onClick={dfs} disabled={running}>DFS</button>
        <button className="btn btn-warning btn-sm" onClick={() => { setVisited({}); setActiveEdges({}); setQueue([]); setLogs([{ type: 'step', msg: 'Reset — graph cleared' }]) }} disabled={running}>Reset</button>
      </div>
      <div className="viz-area">
        <svg width={W} height={H} style={{ minWidth: W, display: 'block' }}>
          <defs>
            <marker id="dir-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="rgba(7,200,249,0.6)" />
            </marker>
            <marker id="act-arr" markerWidth="8" markerHeight="8" refX="7" refY="3" orient="auto">
              <path d="M0,0 L0,6 L8,3 z" fill="#10b981" />
            </marker>
          </defs>
          {edges.map((e, i) => {
            const from = nodes[e.from], to = nodes[e.to]
            const isActive = activeEdges[`${e.from}-${e.to}`] || activeEdges[`${e.to}-${e.from}`]
            const dx = to.x - from.x, dy = to.y - from.y
            const len = Math.sqrt(dx * dx + dy * dy)
            const nx = dx / len, ny = dy / len
            const x1 = from.x + nx * 22, y1 = from.y + ny * 22
            const x2 = to.x - nx * 22, y2 = to.y - ny * 22
            return (
              <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isActive ? '#10b981' : 'rgba(7,200,249,0.4)'}
                strokeWidth={isActive ? 2.5 : 1.5}
                markerEnd={directed ? (isActive ? 'url(#act-arr)' : 'url(#dir-arr)') : undefined}
                style={{ transition: 'stroke 0.3s' }}
              />
            )
          })}
          {nodes.map(n => {
            const state = visited[n.id]
            const fill = state === 'current' ? 'rgba(245,158,11,0.7)' : state === 'visited' ? 'rgba(16,185,129,0.6)' : state === 'queued' ? 'rgba(99,102,241,0.5)' : 'rgba(7,200,249,0.35)'
            const stroke = state === 'current' ? '#f59e0b' : state === 'visited' ? '#10b981' : state === 'queued' ? '#6366f1' : 'rgba(7,200,249,0.6)'
            return (
              <motion.g key={n.id} animate={{ scale: state === 'current' ? 1.2 : 1 }} transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <circle cx={n.x} cy={n.y} r={22} fill={fill} stroke={stroke} strokeWidth="2"
                  style={{ filter: state ? `drop-shadow(0 0 8px ${stroke})` : 'none', transition: 'fill 0.3s, stroke 0.3s' }}
                />
                <text x={n.x} y={n.y + 5} textAnchor="middle" fill="#0f172a" fontSize="14" fontWeight="700">{n.label}</text>
              </motion.g>
            )
          })}
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 12, fontSize: 11, color: 'var(--text3)', justifyContent: 'center', flexWrap: 'wrap' }}>
        <span><span style={{ color: 'var(--warning)' }}>■</span> Current</span>
        <span><span style={{ color: 'var(--accent)' }}>■</span> Queued</span>
        <span><span style={{ color: 'var(--success)' }}>■</span> Visited</span>
        {queue.length > 0 && <span>Queue: [{queue.map(q => nodes[q].label).join(', ')}]</span>}
      </div>
      <ActionLog logs={logs} />
    </div>
  )
}
