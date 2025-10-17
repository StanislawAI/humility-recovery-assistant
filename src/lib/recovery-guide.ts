import { promises as fs } from 'fs'
import path from 'path'

// Simple in-memory cache so we don't hit the filesystem on every request
let cachedGuideText: string | null = null
let cachedChunks: string[] | null = null

function normalizeWhitespace(text: string): string {
  return text.replace(/\r\n?/g, '\n').replace(/\t/g, '  ')
}

export async function loadRecoveryGuide(): Promise<string> {
  if (cachedGuideText) {
    return cachedGuideText
  }
  const guidePath = path.join(process.cwd(), 'documents', 'recovery-guide.txt')
  const file = await fs.readFile(guidePath, 'utf8')
  cachedGuideText = normalizeWhitespace(file).trim()
  return cachedGuideText
}

// Split the guide into chunks by section-like boundaries.
// Heuristics: split on lines that look like headers (##, Part X:, Module X, or ALL CAPS line).
export async function getGuideChunks(): Promise<string[]> {
  if (cachedChunks) {
    return cachedChunks
  }
  const guide = await loadRecoveryGuide()
  const lines = guide.split('\n')

  const chunks: string[] = []
  let current: string[] = []

  function pushCurrent() {
    const text = current.join('\n').trim()
    if (text.length > 0) {
      chunks.push(text)
    }
    current = []
  }

  const headerRegex = /^(#{1,6}\s+|Part\s+\d+|Module\s+\d+|[A-Z][A-Z\s\-,&]+:)\b/
  for (const line of lines) {
    if (headerRegex.test(line)) {
      // start a new chunk at headers
      pushCurrent()
      current.push(line)
    } else {
      current.push(line)
    }
  }
  pushCurrent()

  // Post-process: if any chunk is very large, further split by double newlines
  const maxChunkChars = 2500
  const normalized: string[] = []
  for (const chunk of chunks) {
    if (chunk.length <= maxChunkChars) {
      normalized.push(chunk)
      continue
    }
    const paras = chunk.split(/\n\n+/)
    let buffer = ''
    for (const para of paras) {
      if ((buffer + '\n\n' + para).length > maxChunkChars) {
        if (buffer.trim().length > 0) normalized.push(buffer.trim())
        buffer = para
      } else {
        buffer = buffer ? buffer + '\n\n' + para : para
      }
    }
    if (buffer.trim().length > 0) normalized.push(buffer.trim())
  }

  cachedChunks = normalized
  return cachedChunks
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

function scoreRelevance(query: string, chunk: string): number {
  const qTokens = tokenize(query)
  const cTokens = tokenize(chunk)
  if (qTokens.length === 0 || cTokens.length === 0) return 0

  const cFreq = new Map<string, number>()
  for (const t of cTokens) cFreq.set(t, (cFreq.get(t) || 0) + 1)

  let score = 0
  for (const t of qTokens) {
    // Slightly boost domain words we expect to be important
    const boost = (t === 'craving' || t === 'obsession' || t === 'surrender' || t === 'sponsor') ? 2 : 1
    score += (cFreq.get(t) || 0) * boost
  }
  // Normalize by chunk length to avoid always picking the longest
  return score / Math.sqrt(cTokens.length)
}

export async function getRelevantGuideChunks(params: {
  question: string
  recentEntriesText?: string
  maxChunks?: number
  maxTotalChars?: number
}): Promise<string[]> {
  const { question, recentEntriesText = '', maxChunks = 6, maxTotalChars = 8000 } = params
  const chunks = await getGuideChunks()
  const query = `${question}\n\n${recentEntriesText}`.trim()

  const scored = chunks
    .map((c) => ({ chunk: c, score: scoreRelevance(query, c) }))
    .sort((a, b) => b.score - a.score)

  const selected: string[] = []
  let used = 0
  for (const { chunk } of scored) {
    if (selected.length >= maxChunks) break
    if (used + chunk.length > maxTotalChars) break
    selected.push(chunk)
    used += chunk.length
  }
  return selected
}


