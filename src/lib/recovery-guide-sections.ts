import { loadRecoveryGuide } from '@/lib/recovery-guide'
import { hashContent } from '@/lib/guide-hash'

export interface GuideSection {
  id: string
  title: string
  content: string
  hash: string
}

export async function getGuideSections(): Promise<GuideSection[]> {
  const text = await loadRecoveryGuide()
  const lines = text.split('\n')

  const sections: { title: string; content: string }[] = []
  let currentTitle = 'Introduction'
  let currentBody: string[] = []

  const push = () => {
    const content = currentBody.join('\n').trim()
    if (content) sections.push({ title: currentTitle, content })
    currentBody = []
  }

  for (const line of lines) {
    if (/^##\s+/.test(line)) {
      push()
      currentTitle = line.replace(/^##\s+/, '').trim()
    } else {
      currentBody.push(line)
    }
  }
  push()

  return sections.map((s, i) => ({
    id: `${i}-${s.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    title: s.title,
    content: s.content,
    hash: hashContent(s.content),
  }))
}


