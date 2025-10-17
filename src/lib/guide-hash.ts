import crypto from 'crypto'

export function normalizeForHash(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, ' ') // collapse whitespace
    .replace(/[.,;:!?()\[\]{}"']/g, '') // strip punctuation
    .trim()
}

export function hashContent(text: string): string {
  const normalized = normalizeForHash(text)
  return crypto.createHash('sha256').update(normalized).digest('hex')
}


