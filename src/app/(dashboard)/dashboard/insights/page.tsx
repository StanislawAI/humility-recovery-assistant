import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export default async function InsightsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  // Get basic stats
  const { data: entries } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)

  const { data: summaries } = await supabase
    .from('daily_summaries')
    .select('*')
    .eq('user_id', user.id)
    .order('date', { ascending: false })

  const totalEntries = entries?.length || 0
  const totalDays = new Set(entries?.map(e => new Date(e.created_at).toDateString())).size
  
  // Calculate streak
  const sortedDates = entries
    ?.map(e => new Date(e.created_at).toDateString())
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime()) || []
  
  let currentStreak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()
  
  if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
    currentStreak = 1
    for (let i = 1; i < sortedDates.length; i++) {
      const prevDate = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toDateString()
      if (sortedDates.includes(prevDate)) {
        currentStreak++
      } else {
        break
      }
    }
  }

  // Entry type distribution
  const typeCounts = entries?.reduce((acc, entry) => {
    acc[entry.entry_type] = (acc[entry.entry_type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Insights & Analytics</h1>
        <p className="text-gray-600 mt-2">
          Track your progress and growth in humility
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEntries}</div>
            <p className="text-xs text-muted-foreground">
              All time reflections
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
            <p className="text-xs text-muted-foreground">
              Days with entries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentStreak}</div>
            <p className="text-xs text-muted-foreground">
              Consecutive days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg per Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalDays > 0 ? (totalEntries / totalDays).toFixed(1) : '0'}
            </div>
            <p className="text-xs text-muted-foreground">
              Entries per active day
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Entry Types</CardTitle>
            <CardDescription>
              How you prefer to record your thoughts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {typeCounts && Object.entries(typeCounts).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <Badge variant="outline" className="capitalize">
                    {type.replace('-', ' ')}
                  </Badge>
                  <span className="text-sm font-medium">{count as number}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Summaries</CardTitle>
            <CardDescription>
              AI-generated insights from your journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            {summaries && summaries.length > 0 ? (
              <div className="space-y-4">
                {summaries.slice(0, 3).map((summary) => (
                  <div key={summary.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(summary.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {summary.summary.length > 100 
                        ? `${summary.summary.substring(0, 100)}...`
                        : summary.summary
                      }
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">
                No summaries yet. Keep adding entries to generate insights!
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


