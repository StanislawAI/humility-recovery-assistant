'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Slider } from '@/components/ui/slider'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Flame, Timer } from 'lucide-react'

interface CravingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const CRAVING_STEPS = [
  {
    step: 1,
    title: 'Announce It',
    description: 'Call or text your sponsor/ally right now. Say: "I\'m having a craving."',
    action: 'contact',
  },
  {
    step: 2,
    title: 'Move Your Body',
    description: 'Do 20 jumping jacks, walk around the block, or dance for 2 minutes.',
    action: 'move',
  },
  {
    step: 3,
    title: 'Breathe',
    description: '4-7-8 breathing: Inhale 4s, hold 7s, exhale 8s. Repeat 5 times.',
    action: 'breathe',
  },
  {
    step: 4,
    title: 'Pray or Ground',
    description: 'Say the Serenity Prayer or name 5 things you can see, 4 you can touch, 3 you can hear.',
    action: 'pray',
  },
  {
    step: 5,
    title: 'Serve Someone',
    description: 'Text encouragement to someone or do a quick act of service.',
    action: 'serve',
  },
  {
    step: 6,
    title: 'Reset Environment',
    description: 'Leave the room. Change your surroundings for 10 minutes.',
    action: 'reset',
  },
]

export function CravingModal({ open, onOpenChange }: CravingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [trigger, setTrigger] = useState('')
  const [intensity, setIntensity] = useState([5])
  const [toolsUsed, setToolsUsed] = useState<string[]>([])
  const [result, setResult] = useState('')
  const [lesson, setLesson] = useState('')
  const [showTimer, setShowTimer] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const supabase = createClient()

  const isOnSteps = currentStep < CRAVING_STEPS.length
  const currentStepData = isOnSteps ? CRAVING_STEPS[currentStep] : null

  function handleNext() {
    if (currentStepData) {
      setToolsUsed(prev => [...prev, currentStepData.action])
    }
    
    if (currentStep < CRAVING_STEPS.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  function startTimer(seconds: number) {
    setTimerSeconds(seconds)
    setShowTimer(true)
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          setShowTimer(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleComplete() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('You must be logged in')
      return
    }

    const { error } = await supabase
      .from('urge_logs')
      .insert({
        user_id: user.id,
        trigger: trigger || null,
        intensity: intensity[0],
        tools_used: toolsUsed,
        result: result || null,
        lesson: lesson || null,
      })

    if (error) {
      toast.error('Failed to save urge log')
      return
    }

    toast.success('Urge log saved! You did it.')
    resetModal()
    onOpenChange(false)
  }

  function resetModal() {
    setCurrentStep(0)
    setTrigger('')
    setIntensity([5])
    setToolsUsed([])
    setResult('')
    setLesson('')
    setShowTimer(false)
    setTimerSeconds(0)
  }

  function handleClose() {
    resetModal()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-900">
            <Flame className="h-5 w-5" />
            Craving Protocol
          </DialogTitle>
          <DialogDescription>
            {isOnSteps 
              ? `Step ${currentStepData!.step} of ${CRAVING_STEPS.length}`
              : 'Record your experience'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {currentStep === 0 && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">What triggered this? (optional)</label>
                <Input
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder="e.g., Felt lonely, saw a trigger online..."
                />
              </div>
              <div>
                <label className="text-sm font-medium">Intensity (1-10)</label>
                <div className="flex items-center gap-3">
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    min={1}
                    max={10}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-lg font-bold w-8 text-center">{intensity[0]}</span>
                </div>
              </div>
            </div>
          )}

          {isOnSteps && currentStepData && (
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <h3 className="font-semibold text-lg">{currentStepData.title}</h3>
              <p className="text-sm">{currentStepData.description}</p>
              
              {currentStepData.action === 'breathe' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startTimer(95)}
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Start 4-7-8 Timer
                </Button>
              )}
              
              {currentStepData.action === 'reset' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => startTimer(600)}
                >
                  <Timer className="h-4 w-4 mr-2" />
                  Start 10-Min Timer
                </Button>
              )}

              {showTimer && (
                <div className="text-center text-2xl font-bold text-primary">
                  {Math.floor(timerSeconds / 60)}:{(timerSeconds % 60).toString().padStart(2, '0')}
                </div>
              )}
            </div>
          )}

          {!isOnSteps && (
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium">How did it go?</label>
                <Textarea
                  value={result}
                  onChange={(e) => setResult(e.target.value)}
                  placeholder="The craving passed... I felt better after..."
                  rows={3}
                />
              </div>
              <div>
                <label className="text-sm font-medium">What did you learn? (optional)</label>
                <Textarea
                  value={lesson}
                  onChange={(e) => setLesson(e.target.value)}
                  placeholder="Next time I'll... I noticed that..."
                  rows={2}
                />
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            {isOnSteps ? (
              <Button onClick={handleNext} className="flex-1">
                {currentStep === CRAVING_STEPS.length - 1 ? 'Finish Steps' : 'Next Step'}
              </Button>
            ) : (
              <Button onClick={handleComplete} className="flex-1">
                Save Log
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
