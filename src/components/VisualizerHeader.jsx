const TITLES = {
  array:     { title: 'Array',                subtitle: 'Random access O(1) · Insert/Delete O(n)',          category: 'Linear' },
  singly:    { title: 'Singly Linked List',   subtitle: 'Sequential access · Dynamic size',                 category: 'Linear' },
  doubly:    { title: 'Doubly Linked List',   subtitle: 'Bidirectional traversal · O(1) delete with ref',   category: 'Linear' },
  circular:  { title: 'Circular Linked List', subtitle: 'Last node points back to head',                    category: 'Linear' },
  stack:     { title: 'Stack',                subtitle: 'LIFO — Last In, First Out',                        category: 'Linear' },
  queue:     { title: 'Queue',                subtitle: 'FIFO — First In, First Out',                       category: 'Linear' },
  bst:       { title: 'Binary Search Tree',   subtitle: 'Left < Root < Right · O(log n) avg',              category: 'Trees' },
  avl:       { title: 'AVL Tree',             subtitle: 'Self-balancing BST · |Balance Factor| ≤ 1',        category: 'Trees' },
  heap:      { title: 'Heap',                 subtitle: 'Complete binary tree · Max/Min heap property',     category: 'Trees' },
  graph:     { title: 'Graph',                subtitle: 'Vertices + Edges · BFS / DFS traversal',           category: 'Graph' },
  sorting:   { title: 'Sorting Algorithms',   subtitle: 'Bubble · Selection · Insertion · Merge · Quick',  category: 'Algorithms' },
  searching: { title: 'Searching Algorithms', subtitle: 'Linear O(n) · Binary O(log n)',                    category: 'Algorithms' },
}

export default function VisualizerHeader({ topic, showNotes, onToggleNotes }) {
  const info = TITLES[topic] || { title: topic, subtitle: '', category: '' }

  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {info.category && (
            <span style={{
              fontSize: 10, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase',
              color: 'var(--primary-dark)', background: 'var(--primary-light)',
              padding: '2px 8px', borderRadius: 20,
            }}>
              {info.category}
            </span>
          )}
        </div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
          {info.title}
        </h1>
        <p style={{ fontSize: 12, color: 'var(--text3)', margin: 0 }}>{info.subtitle}</p>
      </div>

      <button
        className={`btn btn-sm ${showNotes ? 'btn-primary' : 'btn-secondary'}`}
        onClick={onToggleNotes}
        aria-pressed={showNotes}
        style={{ gap: 6 }}
      >
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="12" height="12" rx="2"/>
          <line x1="5" y1="6" x2="11" y2="6"/>
          <line x1="5" y1="9" x2="9" y2="9"/>
        </svg>
        {showNotes ? 'Hide Notes' : 'Show Notes'}
      </button>
    </div>
  )
}
