'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { ArrowRight, Plus, Trash2, ToggleLeft, ToggleRight, Lightbulb, Edit2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Trigger {
  id: string
  user_id: string
  trigger_name: string
  trigger_type: string
  countermeasure: string
  effectiveness_score: number
  times_used: number
  active: boolean
  created_at: string
  updated_at: string
}

const DEFAULT_TRIGGERS = [
  {
    trigger_name: 'Isolation',
    trigger_type: 'environmental',
    countermeasure: 'Call ally + light change + water + 10-minute walk',
    effectiveness_score: 8,
  },
  {
    trigger_name: 'Late night',
    trigger_type: 'temporal',
    countermeasure: 'Call ally + light change + water + 10-minute walk',
    effectiveness_score: 8,
  },
  {
    trigger_name: 'Fatigue',
    trigger_type: 'physical',
    countermeasure: 'Call ally + light change + water + 10-minute walk',
    effectiveness_score: 8,
  },
  {
    trigger_name: 'Success/high dopamine',
    trigger_type: 'emotional',
    countermeasure: 'Gratitude list + service micro-task',
    effectiveness_score: 7,
  },
  {
    trigger_name: 'Failure/shame',
    trigger_type: 'emotional',
    countermeasure: 'Gratitude list + service micro-task',
    effectiveness_score: 7,
  },
  {
    trigger_name: 'Device scrolling',
    trigger_type: 'behavioral',
    countermeasure: 'App block + physical distance + 1-page spiritual reading',
    effectiveness_score: 9,
  },
  {
    trigger_name: 'Boredom',
    trigger_type: 'emotional',
    countermeasure: 'App block + physical distance + 1-page spiritual reading',
    effectiveness_score: 8,
  },
  {
    trigger_name: 'HALT - Hungry',
    trigger_type: 'physical',
    countermeasure: 'Eat protein',
    effectiveness_score: 9,
  },
  {
    trigger_name: 'HALT - Angry',
    trigger_type: 'emotional',
    countermeasure: 'Box breathing',
    effectiveness_score: 8,
  },
  {
    trigger_name: 'HALT - Lonely',
    trigger_type: 'emotional',
    countermeasure: 'Connection call',
    effectiveness_score: 9,
  },
  {
    trigger_name: 'HALT - Tired',
    trigger_type: 'physical',
    countermeasure: '20-minute nap',
    effectiveness_score: 9,
  },
]

export function TriggersTracker() {
  const [triggers, setTriggers] = useState<Trigger[]>([])
  const [showDefaults, setShowDefaults] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<Trigger | null>(null)
  const [newTriggerName, setNewTriggerName] = useState('')
  const [newTriggerType, setNewTriggerType] = useState('')
  const [newCountermeasure, setNewCountermeasure] = useState('')
  const [newEffectivenessScore, setNewEffectivenessScore] = useState('5')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadTriggers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadTriggers() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('triggers')
      .select('*')
      .eq('user_id', user.id)
      .order('times_used', { ascending: false })

    if (data) {
      setTriggers(data)
      if (data.length === 0) {
        setShowDefaults(true)
      }
    }
    setLoading(false)
  }

  async function addAllDefaults() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('triggers')
      .insert(
        DEFAULT_TRIGGERS.map(trigger => ({
          user_id: user.id,
          trigger_name: trigger.trigger_name,
          trigger_type: trigger.trigger_type,
          countermeasure: trigger.countermeasure,
          effectiveness_score: trigger.effectiveness_score,
          times_used: 0,
          active: true,
        }))
      )

    if (error) {
      toast.error('Failed to add default triggers')
      return
    }

    toast.success('Default triggers added!')
    setShowDefaults(false)
    loadTriggers()
  }

  async function addTrigger() {
    if (!newTriggerName || !newCountermeasure) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const effectivenessValue = parseInt(newEffectivenessScore)
    if (isNaN(effectivenessValue) || effectivenessValue < 1 || effectivenessValue > 10) {
      toast.error('Effectiveness score must be between 1 and 10')
      return
    }

    const { error } = await supabase
      .from('triggers')
      .insert({
        user_id: user.id,
        trigger_name: newTriggerName,
        trigger_type: newTriggerType || 'other',
        countermeasure: newCountermeasure,
        effectiveness_score: effectivenessValue,
        times_used: 0,
        active: true,
      })

    if (error) {
      toast.error('Failed to add trigger')
      return
    }

    toast.success('Trigger added!')
    resetAddForm()
    setShowAddDialog(false)
    loadTriggers()
  }

  async function updateTrigger() {
    if (!editingTrigger || !newTriggerName || !newCountermeasure) return

    const effectivenessValue = parseInt(newEffectivenessScore)
    if (isNaN(effectivenessValue) || effectivenessValue < 1 || effectivenessValue > 10) {
      toast.error('Effectiveness score must be between 1 and 10')
      return
    }

    const { error } = await supabase
      .from('triggers')
      .update({
        trigger_name: newTriggerName,
        trigger_type: newTriggerType || 'other',
        countermeasure: newCountermeasure,
        effectiveness_score: effectivenessValue,
        updated_at: new Date().toISOString(),
      })
      .eq('id', editingTrigger.id)

    if (error) {
      toast.error('Failed to update trigger')
      return
    }

    toast.success('Trigger updated!')
    resetAddForm()
    setShowEditDialog(false)
    setEditingTrigger(null)
    loadTriggers()
  }

  async function incrementTimesUsed(trigger: Trigger) {
    const { error } = await supabase
      .from('triggers')
      .update({
        times_used: trigger.times_used + 1,
        updated_at: new Date().toISOString(),
      })
      .eq('id', trigger.id)

    if (error) {
      toast.error('Failed to update counter')
      return
    }

    toast.success('Countermeasure applied! +1')
    setTriggers(triggers.map(t => 
      t.id === trigger.id ? { ...t, times_used: t.times_used + 1 } : t
    ))
  }

  async function toggleActive(trigger: Trigger) {
    const { error } = await supabase
      .from('triggers')
      .update({
        active: !trigger.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', trigger.id)

    if (error) {
      toast.error('Failed to update trigger')
      return
    }

    setTriggers(triggers.map(t => 
      t.id === trigger.id ? { ...t, active: !t.active } : t
    ))
  }

  async function deleteTrigger(id: string) {
    const { error } = await supabase
      .from('triggers')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete trigger')
      return
    }

    toast.success('Trigger deleted')
    setTriggers(triggers.filter(t => t.id !== id))
  }

  function openEditDialog(trigger: Trigger) {
    setEditingTrigger(trigger)
    setNewTriggerName(trigger.trigger_name)
    setNewTriggerType(trigger.trigger_type)
    setNewCountermeasure(trigger.countermeasure)
    setNewEffectivenessScore(trigger.effectiveness_score.toString())
    setShowEditDialog(true)
  }

  function resetAddForm() {
    setNewTriggerName('')
    setNewTriggerType('')
    setNewCountermeasure('')
    setNewEffectivenessScore('5')
  }

  if (loading) {
    return (
      <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
        <CardHeader>
          <CardTitle className="text-neutral-50">Triggers & Countermeasures</CardTitle>
          <CardDescription className="text-neutral-300">Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <>
      <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-neutral-50">Triggers & Countermeasures</CardTitle>
              <CardDescription className="text-neutral-300">Track what triggers you and what works to counter them</CardDescription>
            </div>
            <Button size="sm" onClick={() => { resetAddForm(); setShowAddDialog(true); }}>
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {showDefaults && (
            <div className="bg-blue-900/30 border border-blue-700/40 p-4 rounded-lg space-y-2">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 text-blue-300 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-100">Get started with common triggers</p>
                  <p className="text-sm text-blue-200">We&apos;ve prepared evidence-based triggers and countermeasures from Recovery.md.</p>
                </div>
              </div>
              <Button size="sm" onClick={addAllDefaults} className="w-full">
                Add All Defaults
              </Button>
            </div>
          )}

          {triggers.length === 0 && !showDefaults && (
            <p className="text-sm text-neutral-300 text-center py-8">
              No triggers yet. Add your first trigger and countermeasure.
            </p>
          )}

          {triggers.map((trigger) => (
            <div
              key={trigger.id}
              className={`border border-neutral-700 rounded-lg p-3 space-y-3 ${!trigger.active ? 'opacity-50 bg-neutral-800/50' : 'bg-neutral-900/30'}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-semibold text-neutral-100">{trigger.trigger_name}</span>
                    <span className="text-xs text-neutral-200 px-2 py-0.5 bg-neutral-800 rounded">
                      {trigger.trigger_type}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-neutral-400 mt-0.5 flex-shrink-0" />
                    <span className="text-neutral-300">{trigger.countermeasure}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-neutral-400">
                    <span>Effectiveness: {trigger.effectiveness_score}/10</span>
                    <span>Used: {trigger.times_used} times</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => incrementTimesUsed(trigger)}
                  className="flex-1"
                  disabled={!trigger.active}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Applied
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => openEditDialog(trigger)}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleActive(trigger)}
                >
                  {trigger.active ? (
                    <ToggleRight className="h-4 w-4" />
                  ) : (
                    <ToggleLeft className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteTrigger(trigger.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Trigger & Countermeasure</DialogTitle>
            <DialogDescription>
              Track a new trigger and the countermeasure that works for you
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trigger Name</label>
              <Input
                value={newTriggerName}
                onChange={(e) => setNewTriggerName(e.target.value)}
                placeholder="e.g., Late night scrolling"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trigger Type</label>
              <Input
                value={newTriggerType}
                onChange={(e) => setNewTriggerType(e.target.value)}
                placeholder="e.g., behavioral, emotional, physical"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Countermeasure</label>
              <Input
                value={newCountermeasure}
                onChange={(e) => setNewCountermeasure(e.target.value)}
                placeholder="e.g., Call ally + 10-min walk"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Effectiveness Score (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={newEffectivenessScore}
                onChange={(e) => setNewEffectivenessScore(e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={addTrigger} 
                className="flex-1" 
                disabled={!newTriggerName || !newCountermeasure}
              >
                Add Trigger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Trigger & Countermeasure</DialogTitle>
            <DialogDescription>
              Update the trigger details and countermeasure
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Trigger Name</label>
              <Input
                value={newTriggerName}
                onChange={(e) => setNewTriggerName(e.target.value)}
                placeholder="e.g., Late night scrolling"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Trigger Type</label>
              <Input
                value={newTriggerType}
                onChange={(e) => setNewTriggerType(e.target.value)}
                placeholder="e.g., behavioral, emotional, physical"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Countermeasure</label>
              <Input
                value={newCountermeasure}
                onChange={(e) => setNewCountermeasure(e.target.value)}
                placeholder="e.g., Call ally + 10-min walk"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Effectiveness Score (1-10)</label>
              <Input
                type="number"
                min="1"
                max="10"
                value={newEffectivenessScore}
                onChange={(e) => setNewEffectivenessScore(e.target.value)}
                placeholder="5"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button 
                onClick={updateTrigger} 
                className="flex-1" 
                disabled={!newTriggerName || !newCountermeasure}
              >
                Update Trigger
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
