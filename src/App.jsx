import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Sidebar from './components/Sidebar'
import VisualizerHeader from './components/VisualizerHeader'
import NotesPanel from './components/NotesPanel'
import ArrayVisualizer from './visualizers/ArrayVisualizer'
import LinkedListVisualizer from './visualizers/LinkedListVisualizer'
import StackVisualizer from './visualizers/StackVisualizer'
import QueueVisualizer from './visualizers/QueueVisualizer'
import BSTVisualizer from './visualizers/BSTVisualizer'
import AVLVisualizer from './visualizers/AVLVisualizer'
import HeapVisualizer from './visualizers/HeapVisualizer'
import GraphVisualizer from './visualizers/GraphVisualizer'
import SortingVisualizer from './visualizers/SortingVisualizer'
import SearchingVisualizer from './visualizers/SearchingVisualizer'

const LL_TYPES = { singly: 'singly', doubly: 'doubly', circular: 'circular' }

function SpeedControl({ speed, onChange }) {
  const label = speed <= 200 ? 'Fast' : speed <= 500 ? 'Medium' : 'Slow'
  return (
    <div className="speed-control">
      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ flexShrink: 0 }}>
        <circle cx="8" cy="8" r="6"/>
        <polyline points="8,5 8,8 10,10"/>
      </svg>
      <span style={{ fontSize: 12, color: 'var(--text3)', whiteSpace: 'nowrap', flexShrink: 0 }}>Speed</span>
      <input
        type="range" min={100} max={1000} step={50} value={speed}
        onChange={e => onChange(+e.target.value)}
        aria-label="Animation speed"
        style={{ flex: 1, minWidth: 60 }}
      />
      <span className="speed-label">{label} ({speed}ms)</span>
    </div>
  )
}

function renderVisualizer(topic, speed) {
  if (LL_TYPES[topic]) return <LinkedListVisualizer type={topic} speed={speed} key={topic} />
  const map = {
    array:     <ArrayVisualizer speed={speed} />,
    stack:     <StackVisualizer speed={speed} />,
    queue:     <QueueVisualizer speed={speed} />,
    bst:       <BSTVisualizer speed={speed} />,
    avl:       <AVLVisualizer speed={speed} />,
    heap:      <HeapVisualizer speed={speed} />,
    graph:     <GraphVisualizer speed={speed} />,
    sorting:   <SortingVisualizer speed={speed} />,
    searching: <SearchingVisualizer speed={speed} />,
  }
  return map[topic] || null
}

export default function App() {
  const [topic, setTopic] = useState('array')
  const [speed, setSpeed] = useState(400)
  const [showNotes, setShowNotes] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('dsa-theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('dsa-theme', dark ? 'dark' : 'light')
  }, [dark])

  const handleSelect = useCallback((t) => { setTopic(t); setShowNotes(false) }, [])

  return (
    <div className="app-layout">
      <Sidebar active={topic} onSelect={handleSelect} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-wrapper">
        {/* Top bar */}
        <header className="topbar">
          <button className="hamburger" onClick={() => setSidebarOpen(o => !o)} aria-label="Toggle sidebar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="2" y1="4" x2="14" y2="4"/>
              <line x1="2" y1="8" x2="14" y2="8"/>
              <line x1="2" y1="12" x2="14" y2="12"/>
            </svg>
          </button>

          <div className="topbar-title-block">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', lineHeight: 1 }}>DSA Visualizer</div>
            <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}>Data Structures &amp; Algorithms</div>
          </div>

          <div className="topbar-spacer" />

          <SpeedControl speed={speed} onChange={setSpeed} />

          <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            aria-label="Toggle dark mode"
            title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {dark ? (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="8" cy="8" r="3.5"/>
                <line x1="8" y1="1" x2="8" y2="2.5"/>
                <line x1="8" y1="13.5" x2="8" y2="15"/>
                <line x1="1" y1="8" x2="2.5" y2="8"/>
                <line x1="13.5" y1="8" x2="15" y2="8"/>
                <line x1="3" y1="3" x2="4.1" y2="4.1"/>
                <line x1="11.9" y1="11.9" x2="13" y2="13"/>
                <line x1="13" y1="3" x2="11.9" y2="4.1"/>
                <line x1="4.1" y1="11.9" x2="3" y2="13"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M13.5 10.5A6 6 0 0 1 5.5 2.5a6 6 0 1 0 8 8z"/>
              </svg>
            )}
          </button>
        </header>

        {/* Content */}
        <main className="main-content" role="main">
          <AnimatePresence mode="wait">
            <motion.div
              key={topic}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
            >
              <div className="card visualizer-card">
                <VisualizerHeader topic={topic} showNotes={showNotes} onToggleNotes={() => setShowNotes(n => !n)} />
                <div style={{ height: 1, background: 'var(--border)' }} />
                {renderVisualizer(topic, speed)}
              </div>

              <AnimatePresence>
                {showNotes && <NotesPanel key="notes" topic={topic} />}
              </AnimatePresence>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}
