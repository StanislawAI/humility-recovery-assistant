'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { CheckCircle2, Circle, Check, BookOpen, ListTodo } from 'lucide-react'
import { toast } from 'sonner'

interface StepWork {
  id: string
  user_id: string
  current_step: number
  readings_completed: string[]
  actions_completed: string[]
  sponsor_feedback: string | null
  notes: string | null
  started_at: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

interface StepHistory {
  id: string
  current_step: number
  started_at: string | null
  completed_at: string | null
}

const STEP_NAMES = [
  'Honesty',
  'Hope',
  'Faith',
  'Courage',
  'Integrity',
  'Readiness',
  'Humility',
  'Willingness',
  'Forgiveness',
  'Maintenance',
  'Awareness',
  'Service',
]

const STEP_READINGS: Record<number, string[]> = {
  1: ['AA Big Book - Step 1', 'Personal Inventory', 'Powerlessness Reading'],
  2: ['AA Big Book - Step 2', 'Higher Power Concepts', 'Sanity Restoration'],
  3: ['AA Big Book - Step 3', 'Decision & Will', 'Third Step Prayer'],
  4: ['AA Big Book - Step 4', 'Inventory Instructions', 'Resentment Work'],
  5: ['AA Big Book - Step 5', 'Sharing Inventory', 'Fifth Step Prayer'],
  6: ['AA Big Book - Step 6', 'Character Defects', 'Readiness Prayer'],
  7: ['AA Big Book - Step 7', 'Humility', 'Seventh Step Prayer'],
  8: ['AA Big Book - Step 8', 'Making a List', 'Willingness'],
  9: ['AA Big Book - Step 9', 'Making Amends', 'Direct Amends'],
  10: ['AA Big Book - Step 10', 'Daily Inventory', 'Spot-Check Inventory'],
  11: ['AA Big Book - Step 11', 'Prayer & Meditation', 'Conscious Contact'],
  12: ['AA Big Book - Step 12', 'Spiritual Awakening', 'Carrying the Message'],
}

const STEP_ACTIONS: Record<number, string[]> = {
  1: ['Write about powerlessness', 'List examples of unmanageability', 'Share with sponsor'],
  2: ['Define your Higher Power', 'List examples of insanity', 'Write Step 2 summary'],
  3: ['Write decision to turn over will', 'Say Third Step Prayer daily', 'Discuss with sponsor'],
  4: ['Complete resentment list', 'Complete fear inventory', 'Complete harm to others', 'Complete sex inventory'],
  5: ['Schedule Step 5', 'Share complete inventory', 'Receive sponsor feedback'],
  6: ['List character defects', 'Write willingness statement', 'Daily prayer for readiness'],
  7: ['Say Seventh Step Prayer', 'Ask for defect removal', 'Share experience with sponsor'],
  8: ['Make complete list', 'Identify amends needed', 'Review with sponsor'],
  9: ['Make direct amends (where safe)', 'Write letters where needed', 'Document progress'],
  10: ['Daily spot-check inventory', 'Promptly admit wrongs', 'Continue personal growth'],
  11: ['Daily prayer practice', 'Daily meditation practice', 'Improve conscious contact'],
  12: ['Practice these principles', 'Carry the message', 'Sponsor others'],
}

export function StepWorkTracker() {
  const [stepWork, setStepWork] = useState<StepWork | null>(null)
  const [history, setHistory] = useState<StepHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [sponsorFeedback, setSponsorFeedback] = useState('')
  const [notes, setNotes] = useState('')
  const supabase = createClient()

  useEffect(() => {
    loadStepWork()
    loadHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (stepWork) {
      setSponsorFeedback(stepWork.sponsor_feedback || '')
      setNotes(stepWork.notes || '')
    }
  }, [stepWork])

  async function loadStepWork() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('step_work')
      .select('*')
      .eq('user_id', user.id)
      .is('completed_at', null)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code === 'PGRST116') {
      const { data: newData, error: insertError } = await supabase
        .from('step_work')
        .insert({
          user_id: user.id,
          current_step: 1,
          readings_completed: [],
          actions_completed: [],
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (!insertError && newData) {
        setStepWork(newData)
      }
    } else if (data) {
      setStepWork(data)
    }
    setLoading(false)
  }

  async function loadHistory() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('step_work')
      .select('id, current_step, started_at, completed_at')
      .eq('user_id', user.id)
      .not('completed_at', 'is', null)
      .order('completed_at', { ascending: false })
      .limit(12)

    if (data) {
      setHistory(data)
    }
  }

  async function toggleReading(reading: string) {
    if (!stepWork) return

    const newReadings = stepWork.readings_completed.includes(reading)
      ? stepWork.readings_completed.filter(r => r !== reading)
      : [...stepWork.readings_completed, reading]

    const { error } = await supabase
      .from('step_work')
      .update({ 
        readings_completed: newReadings,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stepWork.id)

    if (error) {
      toast.error('Failed to update readings')
      return
    }

    setStepWork({ ...stepWork, readings_completed: newReadings })
  }

  async function toggleAction(action: string) {
    if (!stepWork) return

    const newActions = stepWork.actions_completed.includes(action)
      ? stepWork.actions_completed.filter(a => a !== action)
      : [...stepWork.actions_completed, action]

    const { error } = await supabase
      .from('step_work')
      .update({ 
        actions_completed: newActions,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stepWork.id)

    if (error) {
      toast.error('Failed to update actions')
      return
    }

    setStepWork({ ...stepWork, actions_completed: newActions })
  }

  async function updateSponsorFeedback() {
    if (!stepWork) return

    const { error } = await supabase
      .from('step_work')
      .update({ 
        sponsor_feedback: sponsorFeedback,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stepWork.id)

    if (error) {
      toast.error('Failed to update sponsor feedback')
      return
    }

    setStepWork({ ...stepWork, sponsor_feedback: sponsorFeedback })
    toast.success('Sponsor feedback saved')
  }

  async function updateNotes() {
    if (!stepWork) return

    const { error } = await supabase
      .from('step_work')
      .update({ 
        notes: notes,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stepWork.id)

    if (error) {
      toast.error('Failed to update notes')
      return
    }

    setStepWork({ ...stepWork, notes: notes })
    toast.success('Notes saved')
  }

  async function completeStep() {
    if (!stepWork) return

    const { error } = await supabase
      .from('step_work')
      .update({ 
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', stepWork.id)

    if (error) {
      toast.error('Failed to complete step')
      return
    }

    if (stepWork.current_step < 12) {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: newData, error: insertError } = await supabase
        .from('step_work')
        .insert({
          user_id: user.id,
          current_step: stepWork.current_step + 1,
          readings_completed: [],
          actions_completed: [],
          started_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (!insertError && newData) {
        setStepWork(newData)
        toast.success(`Completed Step ${stepWork.current_step}! Now working on Step ${newData.current_step}`)
        loadHistory()
      }
    } else {
      toast.success('Congratulations! You have completed all 12 steps!')
      loadStepWork()
      loadHistory()
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step Work Tracker</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (!stepWork) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Step Work Tracker</CardTitle>
          <CardDescription>No active step work found</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const currentStepReadings = STEP_READINGS[stepWork.current_step] || []
  const currentStepActions = STEP_ACTIONS[stepWork.current_step] || []
  const readingsProgress = currentStepReadings.length > 0 
    ? stepWork.readings_completed.filter(r => currentStepReadings.includes(r)).length 
    : 0
  const actionsProgress = currentStepActions.length > 0
    ? stepWork.actions_completed.filter(a => currentStepActions.includes(a)).length
    : 0

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Step {stepWork.current_step}: {STEP_NAMES[stepWork.current_step - 1]}</CardTitle>
              <CardDescription>
                {readingsProgress}/{currentStepReadings.length} readings · {actionsProgress}/{currentStepActions.length} actions
              </CardDescription>
            </div>
            <Button
              onClick={completeStep}
              disabled={readingsProgress < currentStepReadings.length || actionsProgress < currentStepActions.length}
            >
              <Check className="mr-2 h-4 w-4" />
              Complete Step
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-1 flex-wrap">
            {Array.from({ length: 12 }, (_, i) => i + 1).map((step) => (
              <div
                key={step}
                className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-medium ${
                  history.some(h => h.current_step === step && h.completed_at)
                    ? 'bg-green-600 text-white'
                    : step === stepWork.current_step
                    ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2'
                    : 'bg-muted text-muted-foreground'
                }`}
                title={`Step ${step}: ${STEP_NAMES[step - 1]}`}
              >
                {step}
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h4 className="text-sm font-medium">Readings</h4>
              <Badge variant="secondary">{readingsProgress}/{currentStepReadings.length}</Badge>
            </div>
            {currentStepReadings.map((reading) => (
              <button
                key={reading}
                onClick={() => toggleReading(reading)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                {stepWork.readings_completed.includes(reading) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={stepWork.readings_completed.includes(reading) ? 'line-through text-muted-foreground' : ''}>
                  {reading}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t pt-6 space-y-3">
            <div className="flex items-center gap-2">
              <ListTodo className="h-5 w-5 text-muted-foreground" />
              <h4 className="text-sm font-medium">Actions</h4>
              <Badge variant="secondary">{actionsProgress}/{currentStepActions.length}</Badge>
            </div>
            {currentStepActions.map((action) => (
              <button
                key={action}
                onClick={() => toggleAction(action)}
                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors text-left"
              >
                {stepWork.actions_completed.includes(action) ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                )}
                <span className={stepWork.actions_completed.includes(action) ? 'line-through text-muted-foreground' : ''}>
                  {action}
                </span>
              </button>
            ))}
          </div>

          <div className="border-t pt-6 space-y-3">
            <h4 className="text-sm font-medium">Sponsor Feedback</h4>
            <Textarea
              value={sponsorFeedback}
              onChange={(e) => setSponsorFeedback(e.target.value)}
              placeholder="Notes from your sponsor about this step..."
              className="min-h-[100px]"
            />
            <Button onClick={updateSponsorFeedback} variant="outline" size="sm">
              Save Feedback
            </Button>
          </div>

          <div className="border-t pt-6 space-y-3">
            <h4 className="text-sm font-medium">Personal Notes</h4>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Your thoughts, insights, and reflections on this step..."
              className="min-h-[100px]"
            />
            <Button onClick={updateNotes} variant="outline" size="sm">
              Save Notes
            </Button>
          </div>
        </CardContent>
      </Card>

      {history.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Step History</CardTitle>
            <CardDescription>Your completed steps</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-600 text-white text-sm font-medium">
                      {item.current_step}
                    </div>
                    <div>
                      <div className="font-medium">Step {item.current_step}: {STEP_NAMES[item.current_step - 1]}</div>
                      {item.started_at && item.completed_at && (
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.started_at).toLocaleDateString()} - {new Date(item.completed_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </div>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
