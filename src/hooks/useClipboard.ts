import { useEffect, useState } from 'react'

export type CopyStatus = 'idle' | 'copied' | 'failed'

const RESET_AFTER_MS = 2500

export const useClipboard = () => {
  const [status, setStatus] = useState<CopyStatus>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = window.setTimeout(() => setStatus('idle'), RESET_AFTER_MS)
    return () => window.clearTimeout(timer)
  }, [status])

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setStatus('copied')
    } catch {
      setStatus('failed')
    }
  }

  return { status, copy }
}
