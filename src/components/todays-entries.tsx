'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { EntryCard } from '@/components/entry-card'
import { Entry } from '@/types/database'
import { format } from 'date-fns'

interface EntriesListProps {
  selectedDate: Date
}

export function TodaysEntries({ selectedDate }: EntriesListProps) {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const supabase = createClient()
  
  useEffect(() => {
    loadEntries()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  async function loadEntries() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Format date as YYYY-MM-DD in local timezone
    const year = selectedDate.getFullYear()
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0')
    const day = String(selectedDate.getDate()).padStart(2, '0')
    const dateStr = `${year}-${month}-${day}`

    const { data, error } = await supabase
      .from('entries')
      .select('*')
      .eq('user_id', user.id)
      .gte('created_at', `${dateStr}T00:00:00.000Z`)
      .lt('created_at', `${dateStr}T23:59:59.999Z`)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching entries:', error)
      setError(true)
    } else if (data) {
      setEntries(data)
    }
    setLoading(false)
  }

  const isToday = selectedDate.toDateString() === new Date().toDateString()

  if (loading) {
  return (
  <div className="text-center text-neutral-400 py-8">
  Loading entries for {format(selectedDate, 'MMMM d, yyyy')}...
  </div>
  )
  }

  if (error) {
  return (
  <div className="text-center text-neutral-400 py-8">
  Failed to load entries for {format(selectedDate, 'MMMM d, yyyy')}
  </div>
  )
  }

  if (!entries || entries.length === 0) {
  return (
  <div className="text-center text-neutral-400 py-8">
  <p className="text-lg">No entries {isToday ? 'yet today' : `on ${format(selectedDate, 'MMMM d, yyyy')}`}</p>
  <p className="text-sm mt-2 text-neutral-500">
  {isToday ? 'Start by adding your first reflection above' : 'Select a different date to view entries'}
  </p>
  </div>
  )
  }

  return (
  <div className="space-y-4">
  <div className="text-center mb-4">
  <h3 className="text-lg font-semibold text-neutral-100">
  Entries for {format(selectedDate, 'MMMM d, yyyy')}
  {isToday && <span className="ml-2 text-sm text-neutral-400">(Today)</span>}
  </h3>
  </div>

  <div className="space-y-4">
  {entries.map((entry) => (
    <EntryCard key={entry.id} entry={entry} />
        ))}
  </div>
  </div>
  )
}

