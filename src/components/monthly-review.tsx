'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { ChevronLeft, ChevronRight, Save, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface MonthlyReview {
    id: string
    user_id: string
    month_start: string
    spiritual_growth: string | null
    recovery_progress: string | null
    body_trends: string | null
    relationships: string | null
    projects_shipped: string | null
    to_subtract: string | null
    created_at: string
    updated_at: string
}

const QUESTIONS = [
    { key: 'spiritual_growth', label: 'Spiritual growth: resist/cooperate notes', placeholder: 'Where did I resist? Where did I cooperate with grace?' },
    { key: 'recovery_progress', label: 'Recovery: step progress; meeting/service consistency', placeholder: 'Which steps progressed? Meetings/service consistency?' },
    { key: 'body_trends', label: 'Body: strength/cardio/sleep trends', placeholder: 'Training volume, recovery markers, sleep trends' },
    { key: 'relationships', label: 'Relationships: depth and service', placeholder: 'Outreach, amends, quality time, service to others' },
    { key: 'projects_shipped', label: 'Projects: shipped outcomes', placeholder: 'What shipped? What moved the needle?' },
    { key: 'to_subtract', label: 'Simplify: subtraction list', placeholder: 'What can I remove to make room for what matters?' },
]

function getMonthStart(date: Date): string {
    const d = new Date(date)
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d.toISOString().split('T')[0]
}

function formatMonth(monthStart: string): string {
    const d = new Date(monthStart)
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
}

export function MonthlyReview() {
    const [review, setReview] = useState<MonthlyReview | null>(null)
    const [currentMonthStart, setCurrentMonthStart] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        setCurrentMonthStart(getMonthStart(new Date()))
    }, [])

    useEffect(() => {
        if (currentMonthStart) {
            loadMonthlyReview(currentMonthStart)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentMonthStart])

    async function loadMonthlyReview(monthStart: string) {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data, error } = await supabase
            .from('monthly_reviews')
            .select('*')
            .eq('user_id', user.id)
            .eq('month_start', monthStart)
            .single()

        if (error && error.code === 'PGRST116') {
            const emptyReview: Partial<MonthlyReview> = {
                user_id: user.id,
                month_start: monthStart,
                spiritual_growth: null,
                recovery_progress: null,
                body_trends: null,
                relationships: null,
                projects_shipped: null,
                to_subtract: null,
            }
            setReview(emptyReview as MonthlyReview)
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
                .from('monthly_reviews')
                .update({
                    spiritual_growth: review.spiritual_growth,
                    recovery_progress: review.recovery_progress,
                    body_trends: review.body_trends,
                    relationships: review.relationships,
                    projects_shipped: review.projects_shipped,
                    to_subtract: review.to_subtract,
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
                .from('monthly_reviews')
                .insert({
                    user_id: user.id,
                    month_start: currentMonthStart,
                    spiritual_growth: review.spiritual_growth,
                    recovery_progress: review.recovery_progress,
                    body_trends: review.body_trends,
                    relationships: review.relationships,
                    projects_shipped: review.projects_shipped,
                    to_subtract: review.to_subtract,
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

    function navigateMonth(direction: 'prev' | 'next') {
        const current = new Date(currentMonthStart)
        const offset = direction === 'prev' ? -1 : 1
        current.setMonth(current.getMonth() + offset)
        setCurrentMonthStart(getMonthStart(current))
    }

    const completedCount = review
        ? QUESTIONS.filter((q) => review[q.key as keyof MonthlyReview] &&
            String(review[q.key as keyof MonthlyReview]).trim().length > 0).length
        : 0
    const isComplete = completedCount === QUESTIONS.length

    const isCurrentMonth = currentMonthStart === getMonthStart(new Date())

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Monthly Review</CardTitle>
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
                        <CardTitle>Monthly Review</CardTitle>
                        <CardDescription>
                            {formatMonth(currentMonthStart)}
                        </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                        {isComplete && (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        )}
                        <span className="text-sm text-muted-foreground">
                            {completedCount} of {QUESTIONS.length} completed
                        </span>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous Month
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigateMonth('next')}
                        disabled={isCurrentMonth}
                    >
                        Next Month
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="space-y-6">
                    {QUESTIONS.map((q) => (
                        <div key={q.key} className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {q.label}
                            </label>
                            <Textarea
                                value={review?.[q.key as keyof MonthlyReview] as string || ''}
                                onChange={(e) => updateField(q.key, e.target.value)}
                                placeholder={q.placeholder}
                                rows={4}
                                className="resize-none"
                            />
                        </div>
                    ))}
                </div>

                <div className="flex justify-end pt-4">
                    <Button onClick={saveReview} disabled={saving}>
                        <Save className="h-4 w-4" />
                        {saving ? 'Saving...' : 'Save Review'}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}


