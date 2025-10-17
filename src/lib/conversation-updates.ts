import { createClient } from '@/lib/supabase/server'
import { getGuideSections, GuideSection } from '@/lib/recovery-guide-sections'

export type HashMap = Record<string, string>

export async function getGuideUpdates(conversationId: string): Promise<{ changed: GuideSection[]; nextHashes: HashMap }> {
  const supabase = await createClient()

  const { data: conv } = await supabase
    .from('conversations')
    .select('guide_section_hashes')
    .eq('id', conversationId)
    .single()

  const previous: HashMap = (conv?.guide_section_hashes as HashMap) || {}

  const sections = await getGuideSections()
  const changed: GuideSection[] = []
  const nextHashes: HashMap = {}

  for (const s of sections) {
    nextHashes[s.id] = s.hash
    if (!previous[s.id] || previous[s.id] !== s.hash) {
      changed.push(s)
    }
  }

  return { changed, nextHashes }
}

export async function saveGuideHashes(conversationId: string, hashes: HashMap): Promise<void> {
  const supabase = await createClient()
  await supabase
    .from('conversations')
    .update({ guide_section_hashes: hashes })
    .eq('id', conversationId)
}


