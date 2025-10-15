import { createClient } from '@/lib/supabase/server'
import { EntryCard } from '@/components/entry-card'

interface TodaysEntriesProps {
  userId: string
}

export async function TodaysEntries({ userId }: TodaysEntriesProps) {
  const supabase = await createClient()
  
  const today = new Date().toISOString().split('T')[0]
  
  const { data: entries, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', `${today}T00:00:00.000Z`)
    .lt('created_at', `${today}T23:59:59.999Z`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching entries:', error)
    return (
      <div className="text-center text-gray-500">
        Failed to load entries
      </div>
    )
  }

  if (!entries || entries.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        <p>No entries yet today</p>
        <p className="text-sm mt-1">Start by adding your first reflection above</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </div>
  )
}

