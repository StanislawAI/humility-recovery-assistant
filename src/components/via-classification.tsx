'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TooltipProvider } from '@/components/ui/tooltip'
import { createClient } from '@/lib/supabase/client'
import { ViaClassification as ViaClassificationType } from '@/types/database'

interface WeeklyDataPoint {
    date: string
    Purgative: number
    Illuminative: number
    Unitive: number
}

import { Heart, Lightbulb, Flame, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'

const VIA_DIMENSIONS = {
    purgative: {
        title: 'Purgative Way',
        subtitle: 'Goodness acting with Faith',
        icon: Flame,
        color: '#ef4444',
        dimensions: [
            {
                key: 'purgative_connection',
                label: 'Connection',
                description: '15-20 calls; sponsor contact; meetings with camera/sharing; WhatsApp engagement'
            },
            {
                key: 'purgative_service',
                label: 'Service',
                description: 'Service roles (ANWA, prison, detox, conference); helping others'
            },
            {
                key: 'purgative_prayer',
                label: 'Prayer Rule',
                description: 'Mass, Rosary, Breviary, Seven Sorrows, meditations'
            },
            {
                key: 'purgative_body',
                label: 'Bodily Discipline',
                description: 'Weights, cardio, stretching, heat/cold exposure, breathwork'
            },
            {
                key: 'purgative_mind',
                label: 'Mind Training',
                description: 'Math, coding, philosophy, theology, art'
            },
        ],
    },
    illuminative: {
        title: 'Illuminative Way',
        subtitle: 'Truth thinking with Hope',
        icon: Lightbulb,
        color: '#3b82f6',
        dimensions: [
            {
                key: 'illuminative_self_knowledge',
                label: 'Self-Knowledge',
                description: 'Daily self-awareness; watch the "built-in forgetter" and disease\'s recuperative power'
            },
            {
                key: 'illuminative_vigilance',
                label: 'Spiritual Vigilance',
                description: 'Armor of God; be sober and alert; recognize the devil as angel of light'
            },
            {
                key: 'illuminative_discipline',
                label: 'Discipline',
                description: '5-second → 1-minute rule; day zero mindset; 1% better daily'
            },
            {
                key: 'illuminative_reframe',
                label: 'Reframe',
                description: 'Pain as cornerstone of growth; choose worthy suffering; external mirrors internal'
            },
        ],
    },
    unitive: {
        title: 'Unitive Way',
        subtitle: 'Beauty seeing with Love',
        icon: Heart,
        color: '#8b5cf6',
        dimensions: [
            {
                key: 'unitive_litmus_love',
                label: 'Litmus of Love',
                description: 'In obsession, choosing not to relapse as highest act of love and service to God and others'
            },
            {
                key: 'unitive_obsession_alchemy',
                label: 'Obsession Alchemy',
                description: 'Expect justifications; let heat pass through; surrender into darkness; euphoria follows endurance'
            },
            {
                key: 'unitive_courage',
                label: 'Courage',
                description: 'Face fear fully (Dune prayer); only the true self remains; cycle mastery'
            },
        ],
    },
}

export function ViaClassification() {
    const [data, setData] = useState<ViaClassificationType | null>(null)
    const [weeklyData, setWeeklyData] = useState<WeeklyDataPoint[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('purgative')
    const supabase = createClient()

    useEffect(() => {
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function loadData() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const today = new Date().toISOString().split('T')[0]

        const { data: todayData, error } = await supabase
            .from('via_classifications')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', today)
            .single()

        if (error && error.code === 'PGRST116') {
            const { data: newData, error: insertError } = await supabase
                .from('via_classifications')
                .insert({
                    user_id: user.id,
                    date: today,
                })
                .select()
                .single()

            if (!insertError && newData) {
                setData(newData)
            }
        } else if (todayData) {
            setData(todayData)
        }

        const sevenDaysAgo = subDays(new Date(), 6).toISOString().split('T')[0]
        const { data: weekData } = await supabase
            .from('via_classifications')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', sevenDaysAgo)
            .order('date', { ascending: true })

        if (weekData) {
            const chartData = weekData.map((day: ViaClassificationType & { date: string }) => {
                const purgativeAvg = [
                    day.purgative_connection,
                    day.purgative_service,
                    day.purgative_prayer,
                    day.purgative_body,
                    day.purgative_mind,
                ].filter(v => v !== null).reduce((sum, val, _, arr) => sum + val / arr.length, 0)

                const illuminativeAvg = [
                    day.illuminative_self_knowledge,
                    day.illuminative_vigilance,
                    day.illuminative_discipline,
                    day.illuminative_reframe,
                ].filter(v => v !== null).reduce((sum, val, _, arr) => sum + val / arr.length, 0)

                const unitiveAvg = [
                    day.unitive_litmus_love,
                    day.unitive_obsession_alchemy,
                    day.unitive_courage,
                ].filter(v => v !== null).reduce((sum, val, _, arr) => sum + val / arr.length, 0)

                return {
                    date: format(new Date(day.date), 'MMM dd'),
                    Purgative: purgativeAvg || 0,
                    Illuminative: illuminativeAvg || 0,
                    Unitive: unitiveAvg || 0,
                }
            })
            setWeeklyData(chartData)
        }

        setLoading(false)
    }

    async function updateDimension(key: keyof ViaClassificationType, value: string) {
        if (!data) return

        const numValue = value === '' ? null : Number(value)

        if (numValue !== null && (numValue < 0 || numValue > 10)) {
            toast.error('Score must be between 0 and 10')
            return
        }

        const { error } = await supabase
            .from('via_classifications')
            .update({
                [key]: numValue,
                updated_at: new Date().toISOString(),
            })
            .eq('id', data.id)

        if (error) {
            toast.error('Failed to update score')
            return
        }

        setData({ ...data, [key]: numValue })
        loadData()
    }

    function calculateAverage(wayKey: keyof typeof VIA_DIMENSIONS) {
        if (!data) return 0
        const dimensions = VIA_DIMENSIONS[wayKey].dimensions
        const values = dimensions
            .map(d => data[d.key as keyof ViaClassificationType])
            .filter(v => v !== null && typeof v === 'number') as number[]

        if (values.length === 0) return 0
        return (values.reduce((sum, val) => sum + val, 0) / values.length).toFixed(1)
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        VIA Classification Tracker
                    </CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
    <TooltipProvider>
    <div className="space-y-6">
    <Card>
    <CardHeader>
    <CardTitle className="flex items-center gap-2">
        <Heart className="h-5 w-5" />
            VIA Classification Tracker
        </CardTitle>
    <CardDescription>
            Track your progress through the three ways of spiritual growth
            </CardDescription>
                    </CardHeader>
                <CardContent>
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-3">
                            {Object.entries(VIA_DIMENSIONS).map(([key, way]) => {
                                const Icon = way.icon
                                return (
                                    <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                                        <Icon className="h-4 w-4" />
                                        {way.title.split(' ')[0]}
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>

                        {Object.entries(VIA_DIMENSIONS).map(([wayKey, way]) => {
                            const Icon = way.icon
                            return (
                                <TabsContent key={wayKey} value={wayKey} className="space-y-4">
                                    <div className="border-l-4 pl-4 py-2" style={{ borderColor: way.color }}>
                                        <div className="flex items-center gap-2 mb-1">
                                            <Icon className="h-5 w-5" style={{ color: way.color }} />
                                            <h3 className="text-lg font-semibold">{way.title}</h3>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{way.subtitle}</p>
                                        <div className="mt-2 text-sm font-medium">
                                            Average Score: <span style={{ color: way.color }}>{calculateAverage(wayKey as keyof typeof VIA_DIMENSIONS)}/10</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-4">
                                        {way.dimensions.map((dimension) => (
                                            <div key={dimension.key} className="space-y-2">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="flex-1">
                                                        <label className="text-sm font-medium block">
                                                            {dimension.label}
                                                        </label>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            {dimension.description}
                                                        </p>
                                                    </div>
                                                    <div className="w-24">
                                                    <Select
                                                    value={data?.[dimension.key as keyof ViaClassificationType]?.toString() || ''}
                                                    onValueChange={(value) => updateDimension(dimension.key as keyof ViaClassificationType, value)}
                                                    >
                                                    <SelectTrigger className="text-center">
                                                        <SelectValue placeholder="0-10" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Array.from({ length: 21 }, (_, i) => (
                                                            <SelectItem key={i} value={(i * 0.5).toString()}>
                                                                    {(i * 0.5).toFixed(1)}
                                                                    </SelectItem>
                                                                 ))}
                                                             </SelectContent>
                                                         </Select>
                                                     </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </TabsContent>
                            )
                        })}
                    </Tabs>
                </CardContent>
            </Card>

            {weeklyData.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Weekly Trend
                        </CardTitle>
                        <CardDescription>
                            Average scores for each way over the past 7 days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={weeklyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="date" />
                                <YAxis domain={[0, 10]} />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="Purgative"
                                    stroke={VIA_DIMENSIONS.purgative.color}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Illuminative"
                                    stroke={VIA_DIMENSIONS.illuminative.color}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="Unitive"
                                    stroke={VIA_DIMENSIONS.unitive.color}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle>Understanding the VIA Ways</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {Object.entries(VIA_DIMENSIONS).map(([key, way]) => {
                        const Icon = way.icon
                        return (
                            <div key={key} className="border-l-4 pl-4 py-2" style={{ borderColor: way.color }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon className="h-5 w-5" style={{ color: way.color }} />
                                    <h4 className="font-semibold">{way.title}</h4>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">{way.subtitle}</p>
                                <ul className="space-y-1 text-sm">
                                    {way.dimensions.map((dim) => (
                                        <li key={dim.key} className="flex gap-2">
                                            <span className="font-medium">{dim.label}:</span>
                                            <span className="text-muted-foreground">{dim.description}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    })}
                </CardContent>
            </Card>
        </div>
        </TooltipProvider>
    )
}
