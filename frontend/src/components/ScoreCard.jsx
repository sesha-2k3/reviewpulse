export default function ScoreCard({ score, label }) {
  const numScore = Number(score) || 0
  const color = numScore >= 7 ? '#4ade80' : numScore >= 5 ? '#fbbf24' : '#f87171'

  return (
    <div style={{
      background: '#141416',
      border: '1px solid rgba(255,255,255,0.06)',
      borderRadius: 16,
      padding: '24px 32px',
      textAlign: 'center',
      minWidth: 140,
    }}>
      <div style={{
        fontFamily: "'Instrument Serif', serif",
        fontSize: 56,
        lineHeight: 1,
        color,
        marginBottom: 4,
      }}>
        {numScore.toFixed(1)}
      </div>
      <div style={{ fontSize: 11, color: '#5a5850', fontFamily: "'DM Mono', monospace", textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </div>
    </div>
  )
}
