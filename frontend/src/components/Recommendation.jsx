const VERDICT_STYLES = {
  Buy:  { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', color: '#4ade80', emoji: '↑' },
  Skip: { bg: 'rgba(248,113,113,0.08)', border: 'rgba(248,113,113,0.2)', color: '#f87171', emoji: '↓' },
  Wait: { bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)', color: '#fbbf24', emoji: '→' },
}

export default function Recommendation({ verdict, reasoning }) {
  const s = VERDICT_STYLES[verdict] || VERDICT_STYLES.Wait

  return (
    <div style={{
      background: s.bg,
      border: `1px solid ${s.border}`,
      borderRadius: 16,
      padding: '20px 24px',
      minWidth: 180,
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
        marginBottom: 8,
      }}>
        Verdict
      </div>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 28,
        color: s.color,
        marginBottom: 6,
      }}>
        {s.emoji} {verdict}
      </div>
      {reasoning && (
        <div style={{ fontSize: 12, color: '#8a8880', lineHeight: 1.5 }}>
          {reasoning.length > 120 ? reasoning.slice(0, 120) + '...' : reasoning}
        </div>
      )}
    </div>
  )
}
