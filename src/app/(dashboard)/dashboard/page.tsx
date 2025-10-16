import { createClient } from '@/lib/supabase/server'
import { CheckInForm } from '@/components/check-in-form'
import { TodaysEntries } from '@/components/todays-entries'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Today&apos;s Journey</h1>
        <p className="text-gray-600 mt-2">
          Track your progress in growing humility today
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
            <CardDescription>
              How are you growing in humility today?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CheckInForm userId={user.id} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Entries</CardTitle>
            <CardDescription>
              Your reflections from today
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodaysEntries userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
