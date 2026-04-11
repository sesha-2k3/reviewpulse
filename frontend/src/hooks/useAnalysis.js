import { useState, useCallback, useRef } from 'react'

export function useAnalysis() {
  const [stage, setStage] = useState('idle')
  const [result, setResult] = useState(null)
  const [product, setProduct] = useState('')
  const [message, setMessage] = useState('')
  const [preview, setPreview] = useState('')
  const abortRef = useRef(null)

  const analyze = useCallback(async (productName) => {
    setProduct(productName)
    setStage('started')
    setResult(null)
    setMessage('')
    setPreview('')

    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch('/api/analyze/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: productName }),
        signal: controller.signal,
      })

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const data = JSON.parse(line.slice(6))

            switch (data.stage) {
              case 'started':
                setStage('started')
                break
              case 'researching':
                setStage('researching')
                setMessage(data.message || 'Searching across all sources...')
                break
              case 'research_complete':
                setStage('research_complete')
                setPreview(data.preview || '')
                break
              case 'synthesizing':
                setStage('synthesizing')
                setMessage(data.message || 'Building your report...')
                break
              case 'complete':
                setStage('complete')
                setResult(data)
                break
            }
          } catch (e) {
            // skip malformed SSE
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setStage('error')
      }
    }
  }, [])

  const reset = useCallback(() => {
    if (abortRef.current) abortRef.current.abort()
    setStage('idle')
    setResult(null)
    setProduct('')
    setMessage('')
    setPreview('')
  }, [])

  const isLoading = ['started', 'researching', 'research_complete', 'synthesizing'].includes(stage)

  return { stage, result, product, message, preview, isLoading, analyze, reset }
}
