import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const SECTIONS = [
  {
    label: 'Linear',
    items: [
      {
        id: 'array', label: 'Array',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="4" width="14" height="8" rx="1.5"/><line x1="5.5" y1="4" x2="5.5" y2="12"/><line x1="10.5" y1="4" x2="10.5" y2="12"/></svg>
      },
      {
        id: 'linkedlist', label: 'Linked List',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="3" cy="8" r="2"/><circle cx="13" cy="8" r="2"/><line x1="5" y1="8" x2="11" y2="8"/><polyline points="9,6 11,8 9,10"/></svg>,
        children: [
          { id: 'singly', label: 'Singly' },
          { id: 'doubly', label: 'Doubly' },
          { id: 'circular', label: 'Circular' },
        ]
      },
      {
        id: 'stack', label: 'Stack',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="2" y="10" width="12" height="3" rx="1"/><rect x="2" y="6.5" width="12" height="3" rx="1"/><rect x="2" y="3" width="12" height="3" rx="1"/></svg>
      },
      {
        id: 'queue', label: 'Queue',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><rect x="1" y="5" width="14" height="6" rx="1.5"/><line x1="5" y1="5" x2="5" y2="11"/><line x1="9" y1="5" x2="9" y2="11"/><polyline points="12,3 14,5 12,7"/></svg>
      },
    ]
  },
  {
    label: 'Trees',
    items: [
      {
        id: 'bst', label: 'BST',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="3" r="2"/><circle cx="4" cy="10" r="2"/><circle cx="12" cy="10" r="2"/><line x1="6.5" y1="4.5" x2="5" y2="8.5"/><line x1="9.5" y1="4.5" x2="11" y2="8.5"/></svg>
      },
      {
        id: 'avl', label: 'AVL Tree',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="3" r="2"/><circle cx="4" cy="10" r="2"/><circle cx="12" cy="10" r="2"/><line x1="6.5" y1="4.5" x2="5" y2="8.5"/><line x1="9.5" y1="4.5" x2="11" y2="8.5"/><path d="M6,14 Q8,12 10,14" strokeDasharray="2,1"/></svg>
      },
      {
        id: 'heap', label: 'Heap',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="8" cy="3" r="2"/><circle cx="4" cy="9" r="2"/><circle cx="12" cy="9" r="2"/><line x1="6.5" y1="4.5" x2="5" y2="7.5"/><line x1="9.5" y1="4.5" x2="11" y2="7.5"/><polyline points="6,2 8,0 10,2"/></svg>
      },
    ]
  },
  {
    label: 'Graph & Algorithms',
    items: [
      {
        id: 'graph', label: 'Graph',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="3" cy="3" r="2"/><circle cx="13" cy="3" r="2"/><circle cx="8" cy="13" r="2"/><line x1="5" y1="3" x2="11" y2="3"/><line x1="4" y1="4.5" x2="7" y2="11.5"/><line x1="12" y1="4.5" x2="9" y2="11.5"/></svg>
      },
      {
        id: 'sorting', label: 'Sorting',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><line x1="2" y1="13" x2="2" y2="7"/><line x1="6" y1="13" x2="6" y2="4"/><line x1="10" y1="13" x2="10" y2="9"/><line x1="14" y1="13" x2="14" y2="2"/></svg>
      },
      {
        id: 'searching', label: 'Searching',
        icon: <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="6.5" cy="6.5" r="4"/><line x1="9.5" y1="9.5" x2="14" y2="14"/></svg>
      },
    ]
  }
]

export default function Sidebar({ active, onSelect, isOpen, onClose }) {
  const [expanded, setExpanded] = useState({ linkedlist: true })

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }))
  const handleSelect = (id) => { onSelect(id); onClose?.() }

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} role="navigation" aria-label="Topics">

        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="#fff" strokeWidth="2">
              <rect x="2" y="6" width="16" height="4" rx="1"/>
              <circle cx="5" cy="15" r="2"/>
              <circle cx="10" cy="15" r="2"/>
              <circle cx="15" cy="15" r="2"/>
              <line x1="5" y1="10" x2="5" y2="13"/>
              <line x1="10" y1="10" x2="10" y2="13"/>
              <line x1="15" y1="10" x2="15" y2="13"/>
            </svg>
          </div>
          <div>
            <div className="sidebar-logo-text">DSA Visualizer</div>
            <div className="sidebar-logo-sub">Interactive Learning</div>
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {SECTIONS.map((section, si) => (
            <div key={section.label}>
              {si > 0 && <div className="divider" />}
              <div className="sidebar-section-label">{section.label}</div>
              {section.items.map(item => (
                <div key={item.id}>
                  <button
                    className={`sidebar-item ${active === item.id ? 'active' : ''}`}
                    onClick={() => item.children ? toggle(item.id) : handleSelect(item.id)}
                    aria-expanded={item.children ? expanded[item.id] : undefined}
                  >
                    <span className="sidebar-item-icon">{item.icon}</span>
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {item.children && (
                      <svg
                        className={`sidebar-item-chevron ${expanded[item.id] ? 'open' : ''}`}
                        width="12" height="12" viewBox="0 0 12 12" fill="none"
                        stroke="currentColor" strokeWidth="2"
                      >
                        <polyline points="3,4.5 6,7.5 9,4.5"/>
                      </svg>
                    )}
                  </button>

                  <AnimatePresence initial={false}>
                    {item.children && expanded[item.id] && (
                      <motion.div
                        className="sidebar-children"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        {item.children.map(child => (
                          <button
                            key={child.id}
                            className={`sidebar-child ${active === child.id ? 'active' : ''}`}
                            onClick={() => handleSelect(child.id)}
                          >
                            {child.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
          <div style={{ fontSize: 11, color: 'var(--text3)', textAlign: 'center' }}>
            12 Data Structures &amp; Algorithms
          </div>
        </div>
      </aside>
    </>
  )
}
