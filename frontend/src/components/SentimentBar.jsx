export default function SentimentBar({ sentiment }) {
  const pos = sentiment?.positive || 0
  const neu = sentiment?.neutral || 0
  const neg = sentiment?.negative || 0
  const total = pos + neu + neg || 1

  const pPct = Math.round((pos / total) * 100)
  const nPct = Math.round((neu / total) * 100)
  const gPct = Math.round((neg / total) * 100)

  return (
    <div style={{
      background: '#141416',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      <div style={{
        fontSize: 11,
        color: '#5a5850',
        fontFamily: "'DM Mono', monospace",
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        marginBottom: 12,
      }}>
        Sentiment breakdown
      </div>

      {/* Bar */}
      <div style={{
        display: 'flex',
        height: 10,
        borderRadius: 99,
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        {pPct > 0 && <div style={{ width: pPct + '%', background: '#4ade80', transition: 'width 0.5s' }} />}
        {nPct > 0 && <div style={{ width: nPct + '%', background: '#8a8880', transition: 'width 0.5s' }} />}
        {gPct > 0 && <div style={{ width: gPct + '%', background: '#f87171', transition: 'width 0.5s' }} />}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, fontSize: 12 }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#4ade80' }} />
          <span style={{ color: '#8a8880' }}>Positive {pPct}%</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#8a8880' }} />
          <span style={{ color: '#8a8880' }}>Neutral {nPct}%</span>
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#f87171' }} />
          <span style={{ color: '#8a8880' }}>Negative {gPct}%</span>
        </span>
      </div>
    </div>
  )
}
