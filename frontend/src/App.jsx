import { useState } from 'react'
import { useAnalysis } from './hooks/useAnalysis'
import ScoreCard from './components/ScoreCard'
import SentimentBar from './components/SentimentBar'
import ProConList from './components/ProConList'
import Recommendation from './components/Recommendation'
import SourceList from './components/SourceList'
import './App.css'

const EXAMPLES = [
  'Core Power Protein Shakes',
  'AirPods Pro 3',
  'Dyson Airwrap',
  'Stanley Quencher Tumbler',
  'Oura Ring Gen 4',
]

const STAGE_LABELS = {
  started: 'Initializing agents...',
  researching: 'Searching Twitter, news, web, and recent content...',
  research_complete: 'Research gathered. Preparing synthesis...',
  synthesizing: 'Analyzing sentiment and building report...',
}

export default function App() {
  const [input, setInput] = useState('')
  const { stage, result, product, message, isLoading, analyze, reset } = useAnalysis()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim()) analyze(input.trim())
  }

  const report = result?.report || {}
  const hasReport = stage === 'complete' && report && !report.parseError

  return (
    <div className="app">
      <header className="header">
        <div className="logo">
          <span className="logo-mark">RP</span>
          <span className="logo-text">ReviewPulse</span>
        </div>
        <p className="tagline">
          AI agent that scours Twitter, news, and forums to build a complete product review.
        </p>
      </header>

      <main className="main">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="search-input-wrap">
            <input
              type="text"
              className="search-input"
              placeholder="Enter any product, brand, or service..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" className="search-btn" disabled={isLoading || !input.trim()}>
              {isLoading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
        </form>

        {stage === 'idle' && (
          <div className="examples">
            <span className="examples-label">Try:</span>
            {EXAMPLES.map((name) => (
              <button key={name} className="chip" onClick={() => { setInput(name); analyze(name) }}>
                {name}
              </button>
            ))}
          </div>
        )}

        {/* Loading panel */}
        {isLoading && (
          <div className="loading-panel">
            <h2 className="section-title">
              Analyzing <em>{product}</em>
            </h2>
            <div className="progress-steps">
              <ProgressStep
                label="Research"
                description="All search tools: Twitter, news, web, fresh"
                active={stage === 'researching' || stage === 'started'}
                done={stage === 'research_complete' || stage === 'synthesizing'}
              />
              <ProgressStep
                label="Synthesis"
                description="Heavy engine structures the report"
                active={stage === 'synthesizing'}
                done={false}
              />
            </div>
            <div className="stage-message">
              <span className="synth-dot" />
              {message || STAGE_LABELS[stage] || 'Working...'}
            </div>
          </div>
        )}

        {/* Results */}
        {hasReport && (
          <div className="results">
            <div className="results-header">
              <h2 className="results-title">{product}</h2>
              <button className="reset-btn" onClick={reset}>New search</button>
            </div>

            <div className="metrics-row">
              <ScoreCard score={report.overallScore} label="Overall score" />
              <SentimentBar sentiment={report.sentimentBreakdown} />
              {report.recommendation && (
                <Recommendation verdict={report.recommendation.verdict} reasoning={report.recommendation.reasoning} />
              )}
            </div>

            <div className="procon-row">
              <ProConList title="Top advantages" items={report.topPros} type="pro" />
              <ProConList title="Top disadvantages" items={report.topCons} type="con" />
            </div>

            {report.keyThemes?.length > 0 && (
              <div className="themes-section">
                <h3 className="section-subtitle">Key themes</h3>
                <div className="theme-chips">
                  {report.keyThemes.map((t, i) => <span key={i} className="theme-chip">{t}</span>)}
                </div>
              </div>
            )}

            {report.painPoints?.length > 0 && (
              <div className="pain-section">
                <h3 className="section-subtitle">Pain points to consider</h3>
                <ul className="pain-list">
                  {report.painPoints.map((p, i) => <li key={i}>{p}</li>)}
                </ul>
              </div>
            )}

            {report.sources?.length > 0 && <SourceList sources={report.sources} />}

            <div className="cost-footer">
              <span>Powered by Subconscious multi-agent orchestration</span>
              <span className="cost-badge">2 agent runs per analysis</span>
            </div>
          </div>
        )}

        {stage === 'complete' && report.parseError && (
          <div className="results">
            <div className="results-header">
              <h2 className="results-title">{product}</h2>
              <button className="reset-btn" onClick={reset}>New search</button>
            </div>
            <div className="raw-result">
              <h3 className="section-subtitle">Analysis result</h3>
              <pre>{report.rawAnswer}</pre>
            </div>
          </div>
        )}

        {stage === 'error' && (
          <div className="error-banner">
            Something went wrong. Check your API key and try again.
            <button className="reset-btn" onClick={reset}>Retry</button>
          </div>
        )}
      </main>

      <footer className="footer">
        <span>Built with Subconscious Platform</span>
      </footer>
    </div>
  )
}

function ProgressStep({ label, description, active, done }) {
  const dotColor = done ? '#4ade80' : active ? '#c5f467' : '#5a5850'
  const textColor = done ? '#4ade80' : active ? '#e8e6e1' : '#5a5850'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      background: active ? 'rgba(197,244,103,0.06)' : 'transparent',
      border: `1px solid ${active ? 'rgba(197,244,103,0.15)' : 'rgba(255,255,255,0.06)'}`,
      borderRadius: 10,
      transition: 'all 0.3s',
    }}>
      <span style={{
        width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0,
        animation: active ? 'pulse 1s ease-in-out infinite' : 'none',
      }} />
      <div>
        <div style={{ fontSize: 14, fontWeight: 500, color: textColor }}>{label}</div>
        <div style={{ fontSize: 12, color: '#8a8880' }}>{description}</div>
      </div>
      {done && <span style={{ marginLeft: 'auto', color: '#4ade80', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Done</span>}
    </div>
  )
}
