import { useEffect, useRef } from 'react'

const TYPE_STYLE = {
  info:    { bg: '#eff6ff', border: '#bfdbfe', dot: '#3b82f6', text: '#1e40af' },
  success: { bg: '#f0fdf4', border: '#bbf7d0', dot: '#10b981', text: '#065f46' },
  warning: { bg: '#fffbeb', border: '#fde68a', dot: '#f59e0b', text: '#92400e' },
  error:   { bg: '#fef2f2', border: '#fecaca', dot: '#ef4444', text: '#991b1b' },
  step:    { bg: '#f8fafc', border: '#e2e8f0', dot: '#94a3b8', text: '#475569' },
}

export default function ActionLog({ logs }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [logs])

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 0,
      border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      background: 'var(--surface)', overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 14px', borderBottom: '1px solid var(--border)',
        background: 'var(--surface2)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="var(--text3)" strokeWidth="2">
            <rect x="2" y="2" width="12" height="12" rx="2"/>
            <line x1="5" y1="6" x2="11" y2="6"/>
            <line x1="5" y1="9" x2="9" y2="9"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text2)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Action Log
          </span>
        </div>
        <span style={{
          fontSize: 10, fontWeight: 600, color: 'var(--text3)',
          background: 'var(--border)', padding: '1px 7px', borderRadius: 20,
        }}>
          {logs.length} {logs.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      {/* Log entries */}
      <div style={{ maxHeight: 160, overflowY: 'auto', overflowX: 'hidden', padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {logs.length === 0 ? (
          <div style={{ padding: '16px 8px', textAlign: 'center', fontSize: 12, color: 'var(--text3)' }}>
            No actions yet. Use the controls above to get started.
          </div>
        ) : (
          logs.map((log, i) => {
            const s = TYPE_STYLE[log.type] || TYPE_STYLE.step
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 8,
                padding: '5px 8px', borderRadius: 6,
                background: i === logs.length - 1 ? s.bg : 'transparent',
                border: i === logs.length - 1 ? `1px solid ${s.border}` : '1px solid transparent',
                transition: 'background 0.2s',
              }}>
                <div style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.dot, flexShrink: 0, marginTop: 5,
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <span style={{
                    fontSize: 12, color: i === logs.length - 1 ? s.text : 'var(--text2)',
                    fontWeight: i === logs.length - 1 ? 600 : 400,
                    lineHeight: 1.4,
                  }}>
                    {log.msg}
                  </span>
                </div>
                <span style={{ fontSize: 10, color: 'var(--text3)', flexShrink: 0, marginTop: 2 }}>
                  #{i + 1}
                </span>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>
    </div>
  )
}
