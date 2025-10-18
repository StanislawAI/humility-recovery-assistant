'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Flame } from 'lucide-react'

type CrucibleState = 'landing' | 'covenant' | 'crucible' | 'victory'

export default function CruciblePage() {
  const [currentState, setCurrentState] = useState<CrucibleState>('landing')

  const handleBeginCrucible = () => {
    setCurrentState('covenant')
  }

  const handleAcceptCovenant = () => {
    setCurrentState('crucible')
  }

  const handleCompleteCrucible = () => {
    setCurrentState('victory')
  }

  const handleReturnToDashboard = () => {
    setCurrentState('landing')
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {currentState === 'landing' && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-destructive flex items-center justify-center gap-2">
                <Flame className="h-8 w-8" />
                The Crucible Protocol
              </CardTitle>
              <CardDescription className="text-lg">
                Emergency support system for moments of intense crisis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-muted-foreground">
                When obsession threatens to overwhelm you, this protocol provides a structured 15-minute
                intervention to help you endure and overcome.
              </p>
              <Button
                onClick={handleBeginCrucible}
                size="lg"
                variant="destructive"
                className="text-xl px-8 py-6 h-auto"
              >
                EMERGENCY: BEGIN CRUCIBLE
              </Button>
            </CardContent>
          </Card>
        )}

        {currentState === 'covenant' && (
          <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
            <Card className="max-w-2xl w-full bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-white">The Covenant</CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-8">
                <p className="text-xl text-slate-200 leading-relaxed">
                  I promise myself, and I promise God, that I will not act on my obsession
                  for the next 15 minutes. My only goal is to endure. My only task is to delay.
                </p>
                <Button
                  onClick={handleAcceptCovenant}
                  size="lg"
                  className="text-lg px-8 py-4 h-auto"
                >
                  I Agree. Begin the 15 Minutes.
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {currentState === 'crucible' && (
          <CrucibleTimer onComplete={handleCompleteCrucible} />
        )}

        {currentState === 'victory' && (
          <Card className="text-center">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-green-600">Victory</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-lg text-muted-foreground">
                The storm has passed. You held the line for 15 minutes. You did not surrender.
                This is a breakthrough. Take a moment to feel the peace you have earned.
              </p>
              <div className="space-y-4">
                <Button onClick={handleReturnToDashboard} size="lg">
                  Return to Dashboard
                </Button>
                <p className="text-sm text-muted-foreground">
                  Consider logging this victory in your journal
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

async function generateNextAction(context: string): Promise<string> {
  try {
    const response = await fetch('/api/ai/advisor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        question: `Generate one simple, actionable step for someone in crisis during The Crucible Protocol. They need immediate, physical action to break their current mental loop. Context: ${context}`,
        context: 'User is in emergency crisis mode, needs immediate physical action to interrupt obsession pattern. Provide only one simple sentence command.'
      }),
    })

    if (!response.ok) {
      throw new Error('Failed to generate action')
    }

    const data = await response.json()
    return data.response || "Take one slow, deep breath. Now."
  } catch (error) {
    console.error('Error generating action:', error)
    // Fallback actions for when AI fails
    const fallbackActions = [
      "Stand up. Walk to the kitchen. Now.",
      "Drink one full glass of cold water. Now.",
      "Go outside for 60 seconds. Feel the air. Now.",
      "Open your phone contacts. Find your Sponsor. Now.",
      "Press the call button. Now."
    ]
    return fallbackActions[Math.floor(Math.random() * fallbackActions.length)]
  }
}

function CrucibleTimer({ onComplete }: { onComplete: () => void }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [currentAction, setCurrentAction] = useState<string>("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [actionHistory, setActionHistory] = useState<string[]>([])

  const litany = `I must not surrender to obsession.
Obsession is the mind-killer.
I will face my obsession. I will permit it to pass over me and through me.
Where the obsession has gone, there will be nothing.
Only I will remain.`

  // Generate initial action
  useEffect(() => {
    const generateInitialAction = async () => {
      setIsGenerating(true)
      const action = await generateNextAction("User beginning emergency protocol")
      setCurrentAction(action)
      setActionHistory([action])
      setIsGenerating(false)
    }

    generateInitialAction()
  }, [])

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          onComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onComplete])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleActionComplete = async () => {
    if (isGenerating) return

    setIsGenerating(true)

    // Generate next action based on current context
    const context = `User completed: "${currentAction}". History: ${actionHistory.join(", ")}. Generate next immediate physical action.`
    const nextAction = await generateNextAction(context)

    setCurrentAction(nextAction)
    setActionHistory(prev => [...prev, nextAction])
    setIsGenerating(false)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-8">
      <div className="w-full max-w-2xl space-y-8">
        {/* Timer */}
        <div className="text-center">
          <div className="text-6xl font-mono text-white mb-4">
            {formatTime(timeLeft)}
          </div>
          <p className="text-slate-400">Time Remaining</p>
        </div>

        {/* Litany */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-6">
            <p className="text-slate-200 text-center leading-relaxed whitespace-pre-line">
              {litany}
            </p>
          </CardContent>
        </Card>

        {/* Current Action */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white text-center">Current Step</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            {isGenerating ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                <span className="ml-3 text-slate-200">Generating next step...</span>
              </div>
            ) : (
              <>
                <p className="text-xl text-slate-200 mb-4">
                  {currentAction}
                </p>
                <Button
                  onClick={handleActionComplete}
                  size="lg"
                  className="w-full"
                  disabled={isGenerating}
                >
                  Complete Step & Get Next
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* Action History */}
        {actionHistory.length > 1 && (
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white text-center">Completed Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {actionHistory.slice(0, -1).map((action, index) => (
                  <div key={index} className="text-slate-300 text-sm p-2 bg-slate-700 rounded">
                    {index + 1}. {action}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
