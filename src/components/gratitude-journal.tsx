'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { Heart, Trash2, User, Lightbulb, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

type GratitudeCategory = 'person' | 'situation' | 'challenge' | 'general'

interface GratitudeEntry {
    id: string
    user_id: string
    content: string
    category: GratitudeCategory
    created_at: string
}

const CATEGORIES = [
    { value: 'person' as const, label: 'Person', icon: User },
    { value: 'situation' as const, label: 'Situation', icon: Lightbulb },
    { value: 'challenge' as const, label: 'Challenge', icon: Sparkles },
    { value: 'general' as const, label: 'General', icon: Heart },
]

export function GratitudeJournal() {
    const [entries, setEntries] = useState<GratitudeEntry[]>([])
    const [todayEntries, setTodayEntries] = useState<GratitudeEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [content, setContent] = useState('')
    const [selectedCategory, setSelectedCategory] = useState<GratitudeCategory>('general')
    const [submitting, setSubmitting] = useState(false)
    const supabase = createClient()

    useEffect(() => {
        loadEntries()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function loadEntries() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const today = new Date().toISOString().split('T')[0]
        const sevenDaysAgo = new Date()
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

        const { data, error } = await supabase
            .from('gratitude_entries')
            .select('*')
            .eq('user_id', user.id)
            .gte('created_at', sevenDaysAgo.toISOString())
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error fetching gratitude entries:', error)
            toast.error('Failed to load gratitude entries')
        } else if (data) {
            setEntries(data)
            const todayData = data.filter(entry =>
                entry.created_at.split('T')[0] === today
            )
            setTodayEntries(todayData)
        }
        setLoading(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!content.trim()) return

        setSubmitting(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('gratitude_entries')
            .insert({
                user_id: user.id,
                content: content.trim(),
                category: selectedCategory,
            })

        if (error) {
            console.error('Error adding gratitude entry:', error)
            toast.error('Failed to add gratitude entry')
        } else {
            toast.success('Gratitude added!')
            setContent('')
            setSelectedCategory('general')
            loadEntries()
        }
        setSubmitting(false)
    }

    async function deleteEntry(id: string) {
        const { error } = await supabase
            .from('gratitude_entries')
            .delete()
            .eq('id', id)

        if (error) {
            console.error('Error deleting gratitude entry:', error)
            toast.error('Failed to delete entry')
        } else {
            toast.success('Entry deleted')
            loadEntries()
        }
    }

    function getCategoryColor(category: GratitudeCategory) {
        switch (category) {
            case 'person':
                return 'bg-blue-100 text-blue-800 border-blue-200'
            case 'situation':
                return 'bg-green-100 text-green-800 border-green-200'
            case 'challenge':
                return 'bg-purple-100 text-purple-800 border-purple-200'
            case 'general':
                return 'bg-pink-100 text-pink-800 border-pink-200'
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Gratitude Journal</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const recentEntries = entries.filter(entry =>
        !todayEntries.some(todayEntry => todayEntry.id === entry.id)
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Gratitude Journal</CardTitle>
                <CardDescription>
                    {todayEntries.length} gratitudes today
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-medium text-muted-foreground">
                        What are 3 things you&apos;re grateful for today?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="I'm grateful for..."
                        disabled={submitting}
                    />

                    <div className="flex gap-2">
                        {CATEGORIES.map((cat) => {
                            const Icon = cat.icon
                            return (
                                <button
                                    key={cat.value}
                                    type="button"
                                    onClick={() => setSelectedCategory(cat.value)}
                                    className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted hover:bg-muted/80'
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {cat.label}
                                </button>
                            )
                        })}
                    </div>

                    <Button type="submit" disabled={submitting || !content.trim()} className="w-full">
                        Add Gratitude
                    </Button>
                </form>

                {todayEntries.length > 0 && (
                    <div className="space-y-3">
                        <h4 className="text-sm font-medium text-muted-foreground">Today</h4>
                        {todayEntries.map((entry) => (
                            <div
                                key={entry.id}
                                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                            >
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm">{entry.content}</p>
                                    <Badge variant="outline" className={getCategoryColor(entry.category)}>
                                        {CATEGORIES.find(c => c.value === entry.category)?.label}
                                    </Badge>
                                </div>
                                <button
                                    onClick={() => deleteEntry(entry.id)}
                                    className="text-muted-foreground hover:text-destructive transition-colors"
                                    aria-label="Delete entry"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {recentEntries.length > 0 && (
                    <div className="space-y-3 border-t pt-4">
                        <h4 className="text-sm font-medium text-muted-foreground">Last 7 Days</h4>
                        {recentEntries.map((entry) => {
                            const date = new Date(entry.created_at)
                            const formattedDate = date.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                            })

                            return (
                                <div
                                    key={entry.id}
                                    className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm">{entry.content}</p>
                                        <div className="flex items-center gap-2">
                                            <Badge variant="outline" className={getCategoryColor(entry.category)}>
                                                {CATEGORIES.find(c => c.value === entry.category)?.label}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">{formattedDate}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteEntry(entry.id)}
                                        className="text-muted-foreground hover:text-destructive transition-colors"
                                        aria-label="Delete entry"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}

                {entries.length === 0 && (
                    <div className="text-center text-muted-foreground py-8">
                        <Heart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                        <p>No gratitude entries yet</p>
                        <p className="text-sm mt-1">Start building your gratitude practice</p>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}
