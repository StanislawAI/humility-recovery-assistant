'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight, Save, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface WeeklyReview {
    id: string
    user_id: string
    week_start: string
    triggers_learned: string | null
    grace_moments: string | null
    commitments_slipped: string | null
    outreach_needed: string | null
    single_focus: string | null
    created_at: string
    updated_at: string
}

const REVIEW_QUESTIONS = [
    {
        key: 'triggers_learned',
        label: 'What did I learn about triggers and tools?',
        placeholder: 'Reflect on what triggered you this week and which tools helped...',
    },
    {
        key: 'grace_moments',
        label: 'Where did I experience grace/connection?',
        placeholder: 'Moments of connection, grace, or unexpected support...',
    },
    {
        key: 'commitments_slipped',
        label: 'Which commitments slipped? What friction do I change this week?',
        placeholder: 'What fell through? What small change would make it easier?',
    },
    {
        key: 'outreach_needed',
        label: 'Who needs an amends, outreach, or thanks?',
        placeholder: 'People you need to reach out to...',
    },
    {
        key: 'single_focus',
        label: 'What is my single focus next week?',
        placeholder: 'One clear, actionable focus for the week ahead...',
    },
]

function getMondayOfWeek(date: Date): string {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    d.setDate(diff)
    d.setHours(0, 0, 0, 0)
    return d.toISOString().split('T')[0]
}

function formatWeekRange(weekStart: string): string {
    const start = new Date(weekStart)
    const end = new Date(start)
    end.setDate(end.getDate() + 6)

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startStr = start.toLocaleDateString('en-US', options)
    const endStr = end.toLocaleDateString('en-US', options)

    return `${startStr} - ${endStr}, ${start.getFullYear()}`
}

export function WeeklyReview() {
    const [review, setReview] = useState<WeeklyReview | null>(null)
    const [currentWeekStart, setCurrentWeekStart] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        const monday = getMondayOfWeek(new Date())
        setCurrentWeekStart(monday)
    }, [])

    useEffect(() => {
        if (currentWeekStart) {
            loadWeeklyReview(currentWeekStart)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentWeekStart])

    async function loadWeeklyReview(weekStart: string) {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('weekly_reviews')
            .select('*')
            .eq('user_id', user.id)
            .eq('week_start', weekStart)
            .single()

        if (error && error.code === 'PGRST116') {
            const emptyReview: Partial<WeeklyReview> = {
                user_id: user.id,
                week_start: weekStart,
                triggers_learned: null,
                grace_moments: null,
                commitments_slipped: null,
                outreach_needed: null,
                single_focus: null,
            }
            setReview(emptyReview as WeeklyReview)
        } else if (data) {
            setReview(data)
        }
        setLoading(false)
    }

    async function saveReview() {
        if (!review) return

        setSaving(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        if (review.id) {
            const { error } = await supabase
                .from('weekly_reviews')
                .update({
                    triggers_learned: review.triggers_learned,
                    grace_moments: review.grace_moments,
                    commitments_slipped: review.commitments_slipped,
                    outreach_needed: review.outreach_needed,
                    single_focus: review.single_focus,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', review.id)

            if (error) {
                toast.error('Failed to save review')
                setSaving(false)
                return
            }
            toast.success('Review saved')
        } else {
            const { data, error } = await supabase
                .from('weekly_reviews')
                .insert({
                    user_id: user.id,
                    week_start: currentWeekStart,
                    triggers_learned: review.triggers_learned,
                    grace_moments: review.grace_moments,
                    commitments_slipped: review.commitments_slipped,
                    outreach_needed: review.outreach_needed,
                    single_focus: review.single_focus,
                })
                .select()
                .single()

            if (error) {
                toast.error('Failed to create review')
                setSaving(false)
                return
            }
            if (data) {
                setReview(data)
                toast.success('Review created')
            }
        }
        setSaving(false)
    }

    function updateField(key: string, value: string) {
        if (!review) return
        setReview({
            ...review,
            [key]: value,
        })
    }

    function navigateWeek(direction: 'prev' | 'next') {
        const current = new Date(currentWeekStart)
        const offset = direction === 'prev' ? -7 : 7
        current.setDate(current.getDate() + offset)
        setCurrentWeekStart(getMondayOfWeek(current))
    }

    const completedCount = review
        ? REVIEW_QUESTIONS.filter((q) => review[q.key as keyof WeeklyReview] &&
            String(review[q.key as keyof WeeklyReview]).trim().length > 0).length
        : 0
    const isComplete = completedCount === REVIEW_QUESTIONS.length

    const isCurrentWeek = currentWeekStart === getMondayOfWeek(new Date())

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Weekly Review</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle>Weekly Review</CardTitle>
                        <CardDescription>
                            {formatWeekRange(currentWeekStart)}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {isComplete && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        <span className="text-sm text-muted-foreground">
                            {completedCount} of {REVIEW_QUESTIONS.length} completed
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateWeek('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous Week
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateWeek('next')}
                        disabled={isCurrentWeek}
                    >
                        Next Week
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {REVIEW_QUESTIONS.map((question) => (
                        <div key={question.key} className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {question.label}
                            </label>
                            <Textarea
                                value={review?.[question.key as keyof WeeklyReview] as string || ''}
                                onChange={(e) => updateField(question.key, e.target.value)}
                                placeholder={question.placeholder}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button
                        onClick={saveReview}
                        disabled={saving}
                    >
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Review'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
