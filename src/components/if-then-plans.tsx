'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createClient } from '@/lib/supabase/client'
import { IfThenPlan } from '@/types/database'
import { ArrowRight, Plus, Trash2, ToggleLeft, ToggleRight, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

const DEFAULT_PLANS = [
  { trigger: 'Late night scrolling or alone', action: 'Dock phone + read 1 page' },
  { trigger: 'Feeling lonely', action: 'Call ally + 10-min walk' },
  { trigger: 'Big win or failure', action: 'Write 3 gratitudes + 1 act of service' },
  { trigger: 'Alone 30+ minutes', action: 'Video meeting or leave house' },
  { trigger: 'Bored or restless', action: 'Movement (walk/stretch) + call someone' },
]

export function IfThenPlans() {
  const [plans, setPlans] = useState<IfThenPlan[]>([])
  const [showDefaults, setShowDefaults] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [newTrigger, setNewTrigger] = useState('')
  const [newAction, setNewAction] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadPlans()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function loadPlans() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('if_then_plans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data) {
      setPlans(data)
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
      .from('if_then_plans')
      .insert(
        DEFAULT_PLANS.map(plan => ({
          user_id: user.id,
          trigger: plan.trigger,
          action: plan.action,
          active: true,
        }))
      )

    if (error) {
      toast.error('Failed to add default plans')
      return
    }

    toast.success('Default plans added!')
    setShowDefaults(false)
    loadPlans()
  }

  async function addPlan() {
    if (!newTrigger || !newAction) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error } = await supabase
      .from('if_then_plans')
      .insert({
        user_id: user.id,
        trigger: newTrigger,
        action: newAction,
        active: true,
      })

    if (error) {
      toast.error('Failed to add plan')
      return
    }

    toast.success('Plan added!')
    setNewTrigger('')
    setNewAction('')
    setShowAddDialog(false)
    loadPlans()
  }

  async function toggleActive(plan: IfThenPlan) {
    const { error } = await supabase
      .from('if_then_plans')
      .update({ 
        active: !plan.active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', plan.id)

    if (error) {
      toast.error('Failed to update plan')
      return
    }

    setPlans(plans.map(p => p.id === plan.id ? { ...p, active: !p.active } : p))
  }

  async function deletePlan(id: string) {
    const { error } = await supabase
      .from('if_then_plans')
      .delete()
      .eq('id', id)

    if (error) {
      toast.error('Failed to delete plan')
      return
    }

    toast.success('Plan deleted')
    setPlans(plans.filter(p => p.id !== id))
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>If-Then Plans</CardTitle>
          <CardDescription>Loading...</CardDescription>
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
              <CardTitle className="text-neutral-50">If-Then Plans</CardTitle>
              <CardDescription className="text-neutral-300">Counter-moves for common triggers</CardDescription>
            </div>
            <Button size="sm" onClick={() => setShowAddDialog(true)}>
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
                  <p className="text-sm font-medium text-blue-100">Get started with default plans</p>
                  <p className="text-sm text-blue-200">We&apos;ve prepared common triggers and counters for you.</p>
                </div>
              </div>
              <Button size="sm" onClick={addAllDefaults} className="w-full">
                Add All Defaults
              </Button>
            </div>
          )}

          {plans.length === 0 && !showDefaults && (
            <p className="text-sm text-neutral-300 text-center py-8">
              No plans yet. Add your first if-then plan.
            </p>
          )}

          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`border border-neutral-700 rounded-lg p-3 space-y-2 ${!plan.active ? 'opacity-50 bg-neutral-800/50' : 'bg-neutral-900/30'}`}
            >
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-neutral-100">If:</span>
                    <span className="text-neutral-300">{plan.trigger}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-neutral-400" />
                    <span className="font-medium text-neutral-100">Then:</span>
                    <span className="text-neutral-300">{plan.action}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleActive(plan)}
                  className="flex-1"
                >
                  {plan.active ? (
                    <>
                      <ToggleRight className="h-4 w-4 mr-1" />
                      Active
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="h-4 w-4 mr-1" />
                      Inactive
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deletePlan(plan.id)}
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
            <DialogTitle>Add If-Then Plan</DialogTitle>
            <DialogDescription>
              Create a personal counter-move for a trigger
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">If (trigger)...</label>
              <Input
                value={newTrigger}
                onChange={(e) => setNewTrigger(e.target.value)}
                placeholder="e.g., Feeling lonely"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Then (action)...</label>
              <Input
                value={newAction}
                onChange={(e) => setNewAction(e.target.value)}
                placeholder="e.g., Call ally + 10-min walk"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                Cancel
              </Button>
              <Button onClick={addPlan} className="flex-1" disabled={!newTrigger || !newAction}>
                Add Plan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
