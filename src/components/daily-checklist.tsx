'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createClient } from '@/lib/supabase/client'
import { DailyChecklist as DailyChecklistType } from '@/types/database'
import { CheckCircle2, Circle } from 'lucide-react'
import { toast } from 'sonner'

const CHECKLIST_ITEMS = [
  { key: 'calls', label: 'Connect with sponsor/ally' },
  { key: 'meeting', label: 'Attend or watch meeting' },
  { key: 'service', label: 'Act of service' },
  { key: 'prayer', label: 'Prayer/meditation' },
  { key: 'body', label: 'Physical movement' },
  { key: 'mind', label: 'Healthy mental input' },
  { key: 'gratitude', label: '3 gratitudes' },
]

const ROUTINE_ITEMS = [
  { key: 'morning', label: 'Morning routine' },
  { key: 'midday', label: 'Midday check-in' },
  { key: 'evening', label: 'Evening review' },
]

export function DailyChecklist() {
  const [checklist, setChecklist] = useState<DailyChecklistType | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTodayChecklist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadTodayChecklist() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_checklists')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (error && error.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('daily_checklists')
        .insert({
          user_id: user.id,
          date: today,
          status: {},
        })
        .select()
        .single()

      if (!insertError && newData) {
        setChecklist(newData)
      }
    } else if (data) {
      setChecklist(data)
    }
    setLoading(false)
  }

  async function toggleItem(key: string) {
    if (!checklist) return

    const newStatus = {
      ...checklist.status,
      [key]: !checklist.status[key],
    }

    const { error } = await supabase
      .from('daily_checklists')
      .update({ 
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', checklist.id)

    if (error) {
      toast.error('Failed to update checklist')
      return
    }

    setChecklist({ ...checklist, status: newStatus })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Daily Checklist</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const completedCount = checklist 
    ? Object.values(checklist.status).filter(Boolean).length 
    : 0
  const totalCount = CHECKLIST_ITEMS.length + ROUTINE_ITEMS.length

  return (
    <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
      <CardHeader>
        <CardTitle className="text-neutral-50">Daily Checklist</CardTitle>
        <CardDescription className="text-neutral-300">
          {completedCount} of {totalCount} completed today
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-neutral-200">Daily Tasks</h4>
          {CHECKLIST_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleItem(item.key)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left"
            >
              {checklist?.status[item.key] ? (
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-neutral-500 flex-shrink-0" />
              )}
              <span className={checklist?.status[item.key] ? 'line-through text-neutral-400' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </div>

        <div className="border-t pt-4 space-y-2">
          <h4 className="text-sm font-medium text-neutral-200">Routines</h4>
          {ROUTINE_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => toggleItem(item.key)}
              className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left"
            >
              {checklist?.status[item.key] ? (
                <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
              ) : (
                <Circle className="h-5 w-5 text-neutral-500 flex-shrink-0" />
              )}
              <span className={checklist?.status[item.key] ? 'line-through text-neutral-400' : ''}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
