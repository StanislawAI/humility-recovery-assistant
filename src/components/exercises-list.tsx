'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Brain, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

const EXERCISES = [
  {
    type: 'urge-surfing',
    name: 'Urge Surfing',
    description: 'Notice the urge like a wave. Observe it rise and fall without acting.',
    guide: 'Notice the urge in your body. Where do you feel it? Rate its intensity 1-10. Watch it like a wave. Breathe. Let it rise, peak, and fall. It will pass.',
  },
  {
    type: 'examen',
    name: 'Daily Examen',
    description: '5-minute review: consolations (life-giving) and desolations (draining).',
    guide: '1. What gave you life today? 2. What drained you today? 3. Where was God present? 4. What are you grateful for? 5. What do you hope for tomorrow?',
  },
  {
    type: 'opposite-action',
    name: 'Opposite Action',
    description: 'Feel the urge to isolate? Call someone. Feel lazy? Move your body.',
    guide: 'Name the unhelpful urge. What does the urge want you to do? Now do the opposite. If isolation calls, reach out. If laziness calls, move.',
  },
  {
    type: 'gratitude-3x3',
    name: 'Gratitude 3×3',
    description: '3 things you are grateful for, 3 reasons why for each.',
    guide: 'Write 3 things you are grateful for today. For each one, write 3 specific reasons why. Be concrete and detailed.',
  },
  {
    type: 'environment-reset',
    name: 'Environment Reset',
    description: 'Change your physical space to break the mental loop.',
    guide: 'Stand up. Leave the room. Go outside. Change your location. Your mind follows your body. Reset your environment.',
  },
  {
    type: 'breath-ladder',
    name: 'Breath Ladder',
    description: 'Box breathing: 4-4-4-4. Repeat 5-10 rounds.',
    guide: 'Breathe in for 4 counts. Hold for 4. Breathe out for 4. Hold for 4. Repeat 5-10 times. Your nervous system will calm.',
  },
  {
    type: 'lectio-divina',
    name: 'Lectio Divina',
    description: 'Read a short passage slowly 3 times. Listen for what stirs.',
    guide: 'Pick a short text (psalm, gospel, poem). Read it slowly. Read it again. What word or phrase stands out? Read it a third time. Sit with that word.',
  },
  {
    type: 'cognitive-defusion',
    name: 'Cognitive Defusion',
    description: 'Notice the thought. Name it. Let it pass like a cloud.',
    guide: 'Notice the thought: "I am having the thought that..." Say it out loud: "I notice I am having the thought that..." Watch it float by like a cloud.',
  },
]

export function ExercisesList() {
  const [selectedExercise, setSelectedExercise] = useState<typeof EXERCISES[0] | null>(null)
  const [notes, setNotes] = useState('')
  const [showDialog, setShowDialog] = useState(false)
  const supabase = createClient()

  function openExercise(exercise: typeof EXERCISES[0]) {
    setSelectedExercise(exercise)
    setNotes('')
    setShowDialog(true)
  }

  async function completeExercise() {
    if (!selectedExercise) return

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('You must be logged in')
      return
    }

    const { error } = await supabase
      .from('exercises_sessions')
      .insert({
        user_id: user.id,
        type: selectedExercise.type,
        notes: notes || null,
      })

    if (error) {
      toast.error('Failed to save exercise')
      return
    }

    toast.success('Exercise completed!')
    setShowDialog(false)
    setSelectedExercise(null)
    setNotes('')
  }

  return (
    <>
      <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-neutral-50">
            <Brain className="h-5 w-5" />
            Recovery Exercises
          </CardTitle>
          <CardDescription className="text-neutral-300">Guided practices for difficult moments</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {EXERCISES.map((exercise) => (
            <button
              key={exercise.type}
              onClick={() => openExercise(exercise)}
              className="w-full text-left p-3 rounded-lg border border-neutral-700 bg-neutral-900/30 hover:bg-neutral-800/50 transition-colors"
            >
              <h4 className="font-medium text-neutral-100">{exercise.name}</h4>
              <p className="text-sm text-neutral-300">{exercise.description}</p>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedExercise?.name}</DialogTitle>
            <DialogDescription>{selectedExercise?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-neutral-900/40 border border-neutral-700 p-4 rounded-lg">
              <p className="text-sm whitespace-pre-line text-neutral-200">{selectedExercise?.guide}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-200">Notes (optional)</label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What did you notice? How do you feel?"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowDialog(false)} className="flex-1">
                Close
              </Button>
              <Button onClick={completeExercise} className="flex-1">
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
