const STATUS_STYLES = {
  pending: { bg: 'rgba(255,255,255,0.03)', border: 'rgba(255,255,255,0.06)', color: '#5a5850', dot: '#5a5850' },
  running: { bg: 'rgba(197,244,103,0.06)', border: 'rgba(197,244,103,0.15)', color: '#c5f467', dot: '#c5f467' },
  complete: { bg: 'rgba(74,222,128,0.06)', border: 'rgba(74,222,128,0.15)', color: '#4ade80', dot: '#4ade80' },
}

export default function AgentStatus({ name, description, status, icon }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.pending
  const label = status === 'pending' ? 'Queued' : status === 'running' ? 'Searching...' : 'Done'

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 10,
      padding: '14px 16px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 16, color: s.color }}>{icon}</span>
        <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 500, color: '#e8e6e1' }}>
          {name}
        </span>
      </div>
      <p style={{ fontSize: 12, color: '#8a8880', marginBottom: 8 }}>{description}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span style={{
          width: 6, height: 6,
          borderRadius: '50%',
          background: s.dot,
          animation: status === 'running' ? 'pulse 1s ease-in-out infinite' : 'none',
        }} />
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: 11,
          color: s.color,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
        }}>
          {label}
        </span>
      </div>
    </div>
  )
}
