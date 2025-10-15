'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { entrySchema, type EntryFormData } from '@/lib/validations/entry'
import { createClient } from '@/lib/supabase/client'
import { Mic, MicOff, Send, Heart, Star, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

interface CheckInFormProps {
  userId: string
}

export function CheckInForm({ userId }: CheckInFormProps) {
  const [isRecording, setIsRecordingState] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      entry_type: 'text',
    },
  })

  const content = watch('content', '')
  const supabase = createClient()

  // Voice recognition will be implemented later

  const startRecording = () => {
    toast.info('Voice recording coming soon!')
  }

  const stopRecording = () => {
    setIsRecordingState(false)
  }

  const onSubmit = async (data: EntryFormData) => {
    setIsSubmitting(true)
    
    try {
      const { error } = await supabase
        .from('entries')
        .insert({
          user_id: userId,
          content: data.content,
          entry_type: data.entry_type,
        })

      if (error) {
        toast.error('Failed to save entry')
        console.error('Error:', error)
      } else {
        toast.success('Entry saved successfully!')
        reset()
      }
    } catch (error) {
      toast.error('An unexpected error occurred')
      console.error('Error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const quickActions = [
    {
      prompt: "How did I show humility today?",
      icon: Heart,
    },
    {
      prompt: "What challenged my humility?",
      icon: Star,
    },
    {
      prompt: "What am I grateful for?",
      icon: Lightbulb,
    },
  ]

  const handleQuickAction = (prompt: string) => {
    setValue('content', prompt)
    setValue('entry_type', 'quick-check')
  }

  return (
    <Tabs defaultValue="text" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="text">Text</TabsTrigger>
        <TabsTrigger value="voice">Voice</TabsTrigger>
        <TabsTrigger value="quick">Quick Check</TabsTrigger>
      </TabsList>

      <TabsContent value="text" className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Textarea
            placeholder="Share how you're growing in humility today..."
            className="min-h-[120px]"
            {...register('content')}
          />
          {errors.content && (
            <p className="text-sm text-red-600">{errors.content.message}</p>
          )}
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {content.length}/5000 characters
            </span>
            <Button type="submit" disabled={isSubmitting || !content.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Entry'}
            </Button>
          </div>
        </form>
      </TabsContent>

      <TabsContent value="voice" className="space-y-4">
        <div className="text-center space-y-4">
          <Card className="p-6">
            <div className="text-sm text-gray-600 mb-4">
              {isRecording ? 'Listening...' : 'Click the microphone to start recording'}
            </div>
            <Button
              onClick={isRecording ? stopRecording : startRecording}
              variant={isRecording ? 'destructive' : 'default'}
              size="lg"
              className="w-20 h-20 rounded-full"
            >
              {isRecording ? (
                <MicOff className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </Button>
          </Card>
          
          {content && (
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-2">Transcript:</div>
              <div className="text-sm">{content}</div>
              <Button
                onClick={() => handleSubmit(onSubmit)()}
                className="mt-4"
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
            </Card>
          )}
        </div>
      </TabsContent>

      <TabsContent value="quick" className="space-y-4">
        <div className="space-y-3">
          <div className="text-sm text-gray-600 mb-4">
            Choose a prompt to get started:
          </div>
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="w-full justify-start h-auto p-4"
              onClick={() => handleQuickAction(action.prompt)}
            >
              <action.icon className="h-4 w-4 mr-3" />
              <span className="text-left">{action.prompt}</span>
            </Button>
          ))}
          
          {content && (
            <Card className="p-4">
              <div className="text-sm text-gray-600 mb-2">Your entry:</div>
              <div className="text-sm mb-4">{content}</div>
              <Button
                onClick={() => handleSubmit(onSubmit)()}
                disabled={isSubmitting}
              >
                <Send className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : 'Save Entry'}
              </Button>
            </Card>
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

