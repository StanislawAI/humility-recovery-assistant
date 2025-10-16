'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Heart, Timer, BookOpen } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { UserSettings } from '@/types/database'

export function EmergencyCard() {
  const [settings, setSettings] = useState<UserSettings | null>(null)
  const [breathingActive, setBreathingActive] = useState(false)
  const [breathingStep, setBreathingStep] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  const [tenMinTimer, setTenMinTimer] = useState<number | null>(null)
  const supabase = createClient()

  useEffect(() => {
    loadSettings()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!breathingActive) return

    const cycleDuration = 4000 + 7000 + 8000
    const timer = setInterval(() => {
      const elapsed = Date.now() % cycleDuration
      if (elapsed < 4000) {
        setBreathingStep('inhale')
      } else if (elapsed < 11000) {
        setBreathingStep('hold')
      } else {
        setBreathingStep('exhale')
      }
    }, 100)

    return () => clearInterval(timer)
  }, [breathingActive])

  useEffect(() => {
    if (tenMinTimer === null) return
    if (tenMinTimer <= 0) {
      setTenMinTimer(null)
      return
    }

    const timer = setTimeout(() => {
      setTenMinTimer(tenMinTimer - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [tenMinTimer])

  async function loadSettings() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setSettings(data)
    }
  }

  function start478Breathing() {
    setBreathingActive(true)
    setTimeout(() => {
      setBreathingActive(false)
    }, 95000)
  }

  function start10MinTimer() {
    setTenMinTimer(600)
  }

  function formatTime(seconds: number) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="border-red-500/40 bg-red-500/10 text-red-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-red-100">
          <Heart className="h-5 w-5" />
          Emergency Support
        </CardTitle>
        <CardDescription className="text-red-100/80">Quick access to emergency tools</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {settings?.emergency_contacts && settings.emergency_contacts.length > 0 && (
          <div className="space-y-2">
            {settings.emergency_contacts.map((contact, idx) => (
              <Button
                key={idx}
                variant="secondary"
                className="w-full justify-start bg-red-600/20 text-red-50 hover:bg-red-600/30"
                asChild
              >
                <a href={`tel:${contact.phone}`}>
                  <Phone className="h-4 w-4 mr-2" />
                  Call {contact.name}
                </a>
              </Button>
            ))}
          </div>
        )}

        <div className="border-t pt-3 space-y-2">
          <Button
            variant={breathingActive ? "default" : "secondary"}
            className="w-full bg-red-600/20 text-red-50 hover:bg-red-600/30"
            onClick={start478Breathing}
            disabled={breathingActive}
          >
            <Timer className="h-4 w-4 mr-2" />
            {breathingActive ? (
              <span>
                {breathingStep === 'inhale' && 'Breathe In (4s)'}
                {breathingStep === 'hold' && 'Hold (7s)'}
                {breathingStep === 'exhale' && 'Breathe Out (8s)'}
              </span>
            ) : (
              '4-7-8 Breathing (5x)'
            )}
          </Button>

          <Button
            variant={tenMinTimer !== null ? "default" : "secondary"}
            className="w-full bg-red-600/20 text-red-50 hover:bg-red-600/30"
            onClick={start10MinTimer}
            disabled={tenMinTimer !== null}
          >
            <Timer className="h-4 w-4 mr-2" />
            {tenMinTimer !== null ? `Leave Room: ${formatTime(tenMinTimer)}` : '10-Min Timer (Leave Room)'}
          </Button>

          <div className="bg-red-950/40 p-3 rounded-lg border border-red-700/40">
            <div className="flex items-start gap-2">
              <BookOpen className="h-4 w-4 mt-0.5 text-red-200" />
              <div className="text-sm text-red-50">
                <p className="font-medium mb-1">Serenity Prayer</p>
                <p className="italic opacity-90">
                  God, grant me the serenity to accept the things I cannot change,
                  courage to change the things I can, and wisdom to know the difference.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-red-950/40 p-3 rounded-lg border border-red-700/40">
            <p className="text-sm font-medium mb-1 text-red-50">Serve Now</p>
            <p className="text-sm text-red-100/90">
              Text someone encouragement • Do a quick chore • Help a neighbor • Call to check in
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
