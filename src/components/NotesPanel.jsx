import { motion, AnimatePresence } from 'framer-motion'

const NOTES = {
  array: {
    desc: 'A contiguous block of memory storing elements of the same type. Supports O(1) random access via index.',
    complexities: [
      ['Access', 'O(1)', 'O(1)'],
      ['Search', 'O(n)', 'O(n)'],
      ['Insert (end)', 'O(1)*', 'O(1)*'],
      ['Insert (mid)', 'O(n)', 'O(n)'],
      ['Delete', 'O(n)', 'O(n)'],
    ],
    apps: ['Lookup tables', 'Matrices', 'Buffers', 'Hash table backing'],
    comparison: null,
  },
  singly: {
    desc: 'Each node holds data and a pointer to the next node. Efficient insertions/deletions at head.',
    complexities: [
      ['Access', 'O(n)', 'O(n)'],
      ['Search', 'O(n)', 'O(n)'],
      ['Insert (head)', 'O(1)', 'O(1)'],
      ['Insert (tail)', 'O(n)', 'O(1)*'],
      ['Delete', 'O(n)', 'O(n)'],
    ],
    apps: ['Undo history', 'Symbol tables', 'Adjacency lists'],
    comparison: {
      headers: ['Operation', 'Array', 'Linked List'],
      rows: [
        ['Random Access', 'O(1) ✅', 'O(n) ❌'],
        ['Insert at Head', 'O(n) ❌', 'O(1) ✅'],
        ['Memory', 'Contiguous', 'Scattered'],
        ['Cache Perf.', 'Excellent', 'Poor'],
      ]
    }
  },
  doubly: {
    desc: 'Each node has next and prev pointers. Enables O(1) deletion when node reference is known.',
    complexities: [
      ['Access', 'O(n)', 'O(n)'],
      ['Insert (head/tail)', 'O(1)', 'O(1)'],
      ['Delete (known node)', 'O(1)', 'O(1)'],
      ['Search', 'O(n)', 'O(n)'],
    ],
    apps: ['Browser history', 'LRU Cache', 'Music playlist'],
    comparison: null,
  },
  circular: {
    desc: 'Last node points back to head. Useful for round-robin scheduling and circular buffers.',
    complexities: [
      ['Traverse', 'O(n)', 'O(n)'],
      ['Insert (head)', 'O(1)', 'O(1)'],
      ['Insert (tail)', 'O(n)', 'O(1)*'],
      ['Delete', 'O(n)', 'O(n)'],
    ],
    apps: ['Round-robin scheduling', 'Circular buffer', 'Multiplayer games'],
    comparison: null,
  },
  stack: {
    desc: 'LIFO structure. Push/pop only from top. Implemented via array or linked list.',
    complexities: [
      ['Push', 'O(1)', 'O(1)'],
      ['Pop', 'O(1)', 'O(1)'],
      ['Peek', 'O(1)', 'O(1)'],
      ['Search', 'O(n)', 'O(n)'],
    ],
    apps: ['Function call stack', 'Undo/Redo', 'Expression parsing', 'DFS'],
    comparison: null,
  },
  queue: {
    desc: 'FIFO structure. Enqueue at rear, dequeue from front.',
    complexities: [
      ['Enqueue', 'O(1)', 'O(1)'],
      ['Dequeue', 'O(1)', 'O(1)'],
      ['Peek', 'O(1)', 'O(1)'],
      ['Search', 'O(n)', 'O(n)'],
    ],
    apps: ['BFS', 'Print spooler', 'Task scheduling', 'Buffers'],
    comparison: null,
  },
  bst: {
    desc: 'Binary tree where left subtree < root < right subtree. Efficient search in balanced case.',
    complexities: [
      ['Search', 'O(log n)', 'O(n)'],
      ['Insert', 'O(log n)', 'O(n)'],
      ['Delete', 'O(log n)', 'O(n)'],
      ['Min/Max', 'O(log n)', 'O(n)'],
    ],
    apps: ['Sorted data', 'Priority queues', 'Symbol tables'],
    comparison: null,
  },
  avl: {
    desc: 'Self-balancing BST. Balance factor = height(left) - height(right) must be in {-1, 0, 1}.',
    complexities: [
      ['Search', 'O(log n)', 'O(log n)'],
      ['Insert', 'O(log n)', 'O(log n)'],
      ['Delete', 'O(log n)', 'O(log n)'],
      ['Rotation', 'O(1)', 'O(1)'],
    ],
    apps: ['Databases', 'In-memory sorted sets', 'Compilers'],
    comparison: null,
  },
  heap: {
    desc: 'Complete binary tree. Max-heap: parent ≥ children. Min-heap: parent ≤ children.',
    complexities: [
      ['Build Heap', 'O(n)', 'O(n)'],
      ['Insert', 'O(log n)', 'O(log n)'],
      ['Extract Min/Max', 'O(log n)', 'O(log n)'],
      ['Peek', 'O(1)', 'O(1)'],
    ],
    apps: ['Priority queues', 'Heap sort', 'Dijkstra', 'Median finding'],
    comparison: null,
  },
  graph: {
    desc: 'Set of vertices connected by edges. Can be directed/undirected, weighted/unweighted.',
    complexities: [
      ['BFS', 'O(V+E)', 'O(V+E)'],
      ['DFS', 'O(V+E)', 'O(V+E)'],
      ['Add Vertex', 'O(1)', 'O(1)'],
      ['Add Edge', 'O(1)', 'O(1)'],
    ],
    apps: ['Social networks', 'Maps/GPS', 'Web crawlers', 'Dependency resolution'],
    comparison: null,
  },
  sorting: {
    desc: 'Rearranging elements in order. Trade-offs between time, space, and stability.',
    complexities: [
      ['Bubble Sort', 'O(n²)', 'O(n²)', 'O(1)', 'Stable'],
      ['Selection Sort', 'O(n²)', 'O(n²)', 'O(1)', 'Unstable'],
      ['Insertion Sort', 'O(n)', 'O(n²)', 'O(1)', 'Stable'],
      ['Merge Sort', 'O(n log n)', 'O(n log n)', 'O(n)', 'Stable'],
      ['Quick Sort', 'O(n log n)', 'O(n²)', 'O(log n)', 'Unstable'],
      ['Heap Sort', 'O(n log n)', 'O(n log n)', 'O(1)', 'Unstable'],
    ],
    apps: ['Database indexing', 'Search engines', 'Data analysis'],
    isSorting: true,
    comparison: null,
  },
  searching: {
    desc: 'Finding an element in a collection. Binary search requires sorted array.',
    complexities: [
      ['Linear Search', 'O(1)', 'O(n)', 'O(n)', 'No'],
      ['Binary Search', 'O(1)', 'O(log n)', 'O(log n)', 'Yes (sorted)'],
    ],
    apps: ['Database lookups', 'Autocomplete', 'Spell checkers'],
    isSearching: true,
    comparison: null,
  },
}

export default function NotesPanel({ topic }) {
  const notes = NOTES[topic]
  if (!notes) return null

  return (
    <motion.div
      className="card visualizer-card"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }} transition={{ duration: 0.3 }}
    >
      <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', marginBottom: 6 }}>Notes &amp; Complexity</div>
      <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65 }}>{notes.desc}</p>

      <table className="complexity-table" style={{ marginTop: 8 }}>
        <thead>
          <tr>
            {notes.isSorting
              ? ['Algorithm', 'Best', 'Worst', 'Space', 'Stable'].map(h => <th key={h}>{h}</th>)
              : notes.isSearching
              ? ['Algorithm', 'Best', 'Worst', 'Avg', 'Requires'].map(h => <th key={h}>{h}</th>)
              : ['Operation', 'Avg', 'Worst'].map(h => <th key={h}>{h}</th>)
            }
          </tr>
        </thead>
        <tbody>
          {notes.complexities.map((row, i) => (
            <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
          ))}
        </tbody>
      </table>

      {notes.comparison && (
        <>
          <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)', marginTop: 14 }}>Comparison</div>
          <table className="complexity-table">
            <thead><tr>{notes.comparison.headers.map(h => <th key={h}>{h}</th>)}</tr></thead>
            <tbody>{notes.comparison.rows.map((row, i) => (
              <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>
            ))}</tbody>
          </table>
        </>
      )}

      <div style={{ marginTop: 10 }}>
        <span style={{ fontSize: 12, color: 'var(--text2)', fontWeight: 600 }}>Applications: </span>
        {notes.apps.map(a => <span key={a} className="tag tag-blue" style={{ marginRight: 4 }}>{a}</span>)}
      </div>
    </motion.div>
  )
}
