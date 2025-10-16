'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { DailyMetrics as DailyMetricsType } from '@/types/database'
import { BarChart3, Plus, Minus } from 'lucide-react'
import { toast } from 'sonner'

const METRICS = [
  { key: 'conn', label: 'Connection', placeholder: '0-10' },
  { key: 'pray', label: 'Prayer', placeholder: '0-10' },
  { key: 'move', label: 'Movement', placeholder: '0-10' },
  { key: 'mind', label: 'Mind', placeholder: '0-10' },
  { key: 'service', label: 'Service', placeholder: '0-10' },
  { key: 'sleep', label: 'Sleep (hrs)', placeholder: '0-12' },
]

export function DailyMetrics() {
  const [metrics, setMetrics] = useState<DailyMetricsType | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTodayMetrics()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadTodayMetrics() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const today = new Date().toISOString().split('T')[0]

    const { data, error } = await supabase
      .from('daily_metrics')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .single()

    if (error && error.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('daily_metrics')
        .insert({
          user_id: user.id,
          date: today,
        })
        .select()
        .single()

      if (!insertError && newData) {
        setMetrics(newData)
      }
    } else if (data) {
      setMetrics(data)
    }
    setLoading(false)
  }

  async function updateMetric(key: keyof DailyMetricsType, value: string) {
    if (!metrics) return

    const numValue = value === '' ? null : Number(value)

    const { error } = await supabase
      .from('daily_metrics')
      .update({
        [key]: numValue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', metrics.id)

    if (error) {
      toast.error('Failed to update metric')
      return
    }

    setMetrics({ ...metrics, [key]: numValue })
  }

  function incrementMetric(key: keyof DailyMetricsType) {
    const metric = METRICS.find(m => m.key === key)
    if (!metric || !metrics) return

    const currentValue = metrics[key as keyof DailyMetricsType] || 0
    const maxValue = key === 'sleep' ? 12 : 10
    const step = key === 'sleep' ? 0.5 : 1
    const newValue = Math.min(currentValue + step, maxValue)

    updateMetric(key, newValue.toString())
  }

  function decrementMetric(key: keyof DailyMetricsType) {
    const metric = METRICS.find(m => m.key === key)
    if (!metric || !metrics) return

    const currentValue = metrics[key as keyof DailyMetricsType] || 0
    const newValue = Math.max(currentValue - (key === 'sleep' ? 0.5 : 1), 0)

    updateMetric(key, newValue.toString())
  }

  if (loading) {
    return (
      <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-50">
            <BarChart3 className="h-5 w-5" />
            Daily Metrics
          </CardTitle>
          <CardDescription className="text-neutral-300">Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-neutral-50">
          <BarChart3 className="h-5 w-5" />
          Daily Metrics
        </CardTitle>
        <CardDescription className="text-neutral-300">Track your daily recovery metrics</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
      {METRICS.map((metric) => {
      const value = metrics?.[metric.key as keyof DailyMetricsType] || 0
      const maxValue = metric.key === 'sleep' ? 12 : 10
      const progressValue = (value / maxValue) * 100

      return (
      <div key={metric.key} className="space-y-3 p-4 rounded-lg bg-neutral-800/50 border border-neutral-700">
      <div className="flex items-center justify-between">
      <label className="text-lg font-semibold text-neutral-100">
        {metric.label}
      </label>
      <span className="text-2xl font-bold text-neutral-50">
        {value}/{maxValue}
      </span>
      </div>

        <Progress
            value={progressValue}
              className="h-3 bg-neutral-700"
              />

              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => decrementMetric(metric.key as keyof DailyMetricsType)}
                  disabled={value <= 0}
                  className="h-12 w-12 p-0 bg-neutral-700 border-neutral-600 hover:bg-neutral-600"
                >
                  <Minus className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                  <Input
                    type="number"
                    min="0"
                    max={maxValue.toString()}
                    step={metric.key === 'sleep' ? '0.5' : '1'}
                    placeholder={metric.placeholder}
                    value={value || ''}
                    onChange={(e) => updateMetric(metric.key as keyof DailyMetricsType, e.target.value)}
                    onBlur={(e) => updateMetric(metric.key as keyof DailyMetricsType, e.target.value)}
                    className="h-12 text-center text-lg font-semibold bg-neutral-700 border-neutral-600 text-neutral-100 placeholder:text-neutral-400"
                  />
                </div>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => incrementMetric(metric.key as keyof DailyMetricsType)}
                  disabled={value >= maxValue}
                  className="h-12 w-12 p-0 bg-neutral-700 border-neutral-600 hover:bg-neutral-600"
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
