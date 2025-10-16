'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { createClient } from '@/lib/supabase/client'
import { Activity, Plus, CheckCircle, ToggleLeft, ToggleRight, Trash2, Clock, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

type DurationCategory = '5min' | '15-30min' | '60+min'

interface ReplacementActivity {
    id: string
    user_id: string
    name: string
    duration_category: DurationCategory
    description?: string
    times_used: number
    last_used?: string
    active: boolean
    created_at: string
}

const DEFAULT_ACTIVITIES: Array<{ name: string; duration_category: DurationCategory; description?: string }> = [
    { name: 'Breathwork', duration_category: '5min', description: 'Box breathing or deep breathing exercises' },
    { name: 'Step reading', duration_category: '5min', description: 'Read a page from recovery literature' },
    { name: '10 pushups', duration_category: '5min', description: 'Quick physical movement to reset' },
    { name: 'Hallway walk', duration_category: '5min', description: 'Walk up and down the hallway' },
    { name: 'Wash face', duration_category: '5min', description: 'Cold water to refresh and reset' },
    { name: 'Gratitude text', duration_category: '5min', description: 'Send a quick thank you message' },
    { name: 'Brisk walk', duration_category: '15-30min', description: 'Get outside and move' },
    { name: 'Kettlebell swings', duration_category: '15-30min', description: 'Physical exercise to burn energy' },
    { name: 'Hot/cold shower', duration_category: '15-30min', description: 'Contrast shower for reset' },
    { name: 'Read inspiring chapter', duration_category: '15-30min', description: 'Dive into meaningful content' },
    { name: 'Tidy a room', duration_category: '15-30min', description: 'Clean and organize your space' },
    { name: 'Workout', duration_category: '60+min', description: 'Full exercise session' },
    { name: 'Deep cleaning', duration_category: '60+min', description: 'Thorough cleaning project' },
    { name: 'Long-walk call with ally', duration_category: '60+min', description: 'Walk while talking with supporter' },
    { name: 'Volunteer action', duration_category: '60+min', description: 'Serve others in your community' },
]

const DURATION_LABELS = {
    '5min': '5 minutes',
    '15-30min': '15-30 minutes',
    '60+min': '60+ minutes',
}

export function ReplacementActivities() {
    const [activities, setActivities] = useState<ReplacementActivity[]>([])
    const [showDefaults, setShowDefaults] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [newName, setNewName] = useState('')
    const [newDuration, setNewDuration] = useState<DurationCategory>('5min')
    const [newDescription, setNewDescription] = useState('')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        loadActivities()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function loadActivities() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('replacement_activities')
            .select('*')
            .eq('user_id', user.id)
            .order('times_used', { ascending: false })

        if (data) {
            setActivities(data)
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
            .from('replacement_activities')
            .insert(
                DEFAULT_ACTIVITIES.map(activity => ({
                    user_id: user.id,
                    name: activity.name,
                    duration_category: activity.duration_category,
                    description: activity.description || null,
                    times_used: 0,
                    active: true,
                }))
            )

        if (error) {
            toast.error('Failed to add default activities')
            return
        }

        toast.success('Default activities added!')
        setShowDefaults(false)
        loadActivities()
    }

    async function addActivity() {
        if (!newName) return

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('replacement_activities')
            .insert({
                user_id: user.id,
                name: newName,
                duration_category: newDuration,
                description: newDescription || null,
                times_used: 0,
                active: true,
            })

        if (error) {
            toast.error('Failed to add activity')
            return
        }

        toast.success('Activity added!')
        setNewName('')
        setNewDescription('')
        setNewDuration('5min')
        setShowAddDialog(false)
        loadActivities()
    }

    async function handleUseActivity(activity: ReplacementActivity) {
        const { error } = await supabase
            .from('replacement_activities')
            .update({
                times_used: activity.times_used + 1,
                last_used: new Date().toISOString(),
            })
            .eq('id', activity.id)

        if (error) {
            toast.error('Failed to log activity')
            return
        }

        toast.success(`${activity.name} logged!`)
        // Update local state optimistically instead of calling loadActivities
        setActivities(prev => prev.map(a =>
            a.id === activity.id
                ? { ...a, times_used: a.times_used + 1, last_used: new Date().toISOString() }
                : a
        ))
    }

    async function toggleActive(activity: ReplacementActivity) {
        const { error } = await supabase
            .from('replacement_activities')
            .update({
                active: !activity.active,
            })
            .eq('id', activity.id)

        if (error) {
            toast.error('Failed to update activity')
            return
        }

        setActivities(activities.map(a => a.id === activity.id ? { ...a, active: !a.active } : a))
    }

    async function deleteActivity(id: string) {
        const { error } = await supabase
            .from('replacement_activities')
            .delete()
            .eq('id', id)

        if (error) {
            toast.error('Failed to delete activity')
            return
        }

        toast.success('Activity deleted')
        setActivities(activities.filter(a => a.id !== id))
    }

    function getActivitiesByDuration(duration: DurationCategory) {
        return activities
            .filter(a => a.duration_category === duration && a.active)
            .sort((a, b) => b.times_used - a.times_used)
    }

    function getInactiveActivities() {
        return activities
            .filter(a => !a.active)
            .sort((a, b) => b.times_used - a.times_used)
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Replacement Activities</CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const durations: DurationCategory[] = ['5min', '15-30min', '60+min']
    const inactiveActivities = getInactiveActivities()

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5" />
                                Replacement Activities
                            </CardTitle>
                            <CardDescription>Healthy alternatives when urges arise</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => setShowAddDialog(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {showDefaults && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Get started with default activities</p>
                                    <p className="text-sm text-blue-700">We&apos;ve prepared healthy alternatives for different time frames.</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={addAllDefaults} className="w-full">
                                Add All Defaults
                            </Button>
                        </div>
                    )}

                    {activities.length === 0 && !showDefaults && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            No activities yet. Add your first replacement activity.
                        </p>
                    )}

                    {durations.map((duration) => {
                        const durationActivities = getActivitiesByDuration(duration)
                        if (durationActivities.length === 0) return null

                        return (
                            <div key={duration} className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <h3 className="font-medium text-sm">{DURATION_LABELS[duration]}</h3>
                                    <Badge variant="secondary" className="text-xs">
                                        {durationActivities.length}
                                    </Badge>
                                </div>
                                <div className="space-y-2">
                                    {durationActivities.map((activity) => (
                                        <div
                                            key={activity.id}
                                            className="border rounded-lg p-3 space-y-2"
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="font-medium text-sm">{activity.name}</h4>
                                                        {activity.times_used > 0 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                {activity.times_used}× used
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {activity.description && (
                                                        <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                                    )}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUseActivity(activity)}
                                                    className="flex-shrink-0"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Use Now
                                                </Button>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => toggleActive(activity)}
                                                    className="flex-1 text-xs"
                                                >
                                                    {activity.active ? (
                                                        <>
                                                            <ToggleRight className="h-3 w-3 mr-1" />
                                                            Active
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft className="h-3 w-3 mr-1" />
                                                            Inactive
                                                        </>
                                                    )}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => deleteActivity(activity.id)}
                                                    className="text-xs"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}

                    {inactiveActivities.length > 0 && (
                        <div className="space-y-2">
                            <h3 className="font-medium text-sm text-muted-foreground">Inactive Activities</h3>
                            <div className="space-y-2">
                                {inactiveActivities.map((activity) => (
                                    <div
                                        key={activity.id}
                                        className="border rounded-lg p-3 bg-muted/50 opacity-50 space-y-2"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-medium text-sm">{activity.name}</h4>
                                                    <Badge variant="outline" className="text-xs">
                                                        {DURATION_LABELS[activity.duration_category]}
                                                    </Badge>
                                                    {activity.times_used > 0 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            {activity.times_used}× used
                                                        </Badge>
                                                    )}
                                                </div>
                                                {activity.description && (
                                                    <p className="text-xs text-muted-foreground mt-1">{activity.description}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => toggleActive(activity)}
                                                className="flex-1 text-xs"
                                            >
                                                <ToggleLeft className="h-3 w-3 mr-1" />
                                                Inactive
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => deleteActivity(activity.id)}
                                                className="text-xs"
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Replacement Activity</DialogTitle>
                        <DialogDescription>
                            Create a healthy alternative for when urges arise
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Activity name</label>
                            <Input
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                placeholder="e.g., Morning run"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Duration</label>
                            <div className="flex gap-2 mt-2">
                                {durations.map((duration) => (
                                    <Button
                                        key={duration}
                                        type="button"
                                        variant={newDuration === duration ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setNewDuration(duration)}
                                        className="flex-1"
                                    >
                                        {DURATION_LABELS[duration]}
                                    </Button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Description (optional)</label>
                            <Textarea
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                placeholder="What does this activity involve?"
                                rows={2}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={addActivity} className="flex-1" disabled={!newName}>
                                Add Activity
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
