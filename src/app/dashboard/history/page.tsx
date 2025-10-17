import { createClient } from '@/lib/supabase/server'
import { EntryCard } from '@/components/entry-card'
import { Card, CardContent } from '@/components/ui/card'

export default async function HistoryPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const { data: entries, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    console.error('Error fetching entries:', error)
    return (
      <div className="text-center text-gray-500 py-8">
        Failed to load entries
      </div>
    )
  }

  // Group entries by date
  const entriesByDate = entries?.reduce((acc, entry) => {
    const date = new Date(entry.created_at).toDateString()
    if (!acc[date]) {
      acc[date] = []
    }
    acc[date].push(entry)
    return acc
  }, {} as Record<string, Array<typeof entries[0]>>)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Entry History</h1>
        <p className="text-muted-foreground mt-2">
          Review your journey of growing in humility
        </p>
      </div>

      {!entries || entries.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">No entries yet</p>
            <p className="text-sm text-gray-400 mt-1">
              Start by adding your first reflection
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(entriesByDate || {}).map(([date, dateEntries]) => (
            <div key={date}>
              <h2 className="text-lg font-semibold text-foreground mb-4">
                {new Date(date).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </h2>
              <div className="space-y-4">
                {(dateEntries as Array<typeof entries[0]>).map((entry) => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

