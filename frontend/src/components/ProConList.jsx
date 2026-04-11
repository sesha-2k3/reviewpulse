export default function ProConList({ title, items = [], type }) {
  const isPro = type === 'pro'
  const color = isPro ? '#4ade80' : '#f87171'
  const dimBg = isPro ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)'
  const dimBorder = isPro ? 'rgba(74,222,128,0.12)' : 'rgba(248,113,113,0.12)'
  const marker = isPro ? '+' : '−'

  return (
    <div style={{
      background: '#141416',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '20px 24px',
    }}>
      <div style={{
        fontSize: 11,
        color: '#5a5850',
        fontFamily: "'DM Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 14,
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 10,
            padding: '10px 12px',
            background: dimBg,
            border: `1px solid ${dimBorder}`,
            borderRadius: 8,
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 14,
              fontWeight: 600,
              color,
              lineHeight: '20px',
              flexShrink: 0,
            }}>
              {marker}
            </span>
            <div>
              <div style={{ fontSize: 14, color: '#e8e6e1', lineHeight: '20px' }}>
                {item.point || item}
              </div>
              {item.frequency && (
                <div style={{ fontSize: 11, color: '#5a5850', marginTop: 2, fontFamily: "'DM Mono', monospace" }}>
                  {item.frequency}
                </div>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && (
          <div style={{ fontSize: 13, color: '#5a5850', fontStyle: 'italic' }}>
            No data available
          </div>
        )}
      </div>
    </div>
  )
}
