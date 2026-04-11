const TYPE_STYLES = {
  social:    { color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', label: 'Social' },
  press:     { color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', label: 'Press' },
  community: { color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', label: 'Community' },
}

export default function SourceList({ sources = [] }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        fontSize: 11,
        color: '#5a5850',
        fontFamily: "'DM Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12,
      }}>
        Sources ({sources.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sources.map((src, i) => {
          const s = TYPE_STYLES[src.type] || TYPE_STYLES.community
          return (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              padding: '10px 14px',
              background: '#141416',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10,
            }}>
              <span style={{
                fontSize: 10,
                fontFamily: "'DM Mono', monospace",
                fontWeight: 500,
                color: s.color,
                background: s.bg,
                padding: '3px 8px',
                borderRadius: 4,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                flexShrink: 0,
                marginTop: 2,
              }}>
                {s.label}
              </span>
              <div>
                <div style={{ fontSize: 13, color: '#e8e6e1', fontWeight: 500 }}>
                  {src.name}
                </div>
                {src.summary && (
                  <div style={{ fontSize: 12, color: '#8a8880', marginTop: 2, lineHeight: 1.5 }}>
                    {src.summary}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
