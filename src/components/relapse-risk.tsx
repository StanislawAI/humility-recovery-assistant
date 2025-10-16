'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { RelapseRiskAssessment as RelapseRiskAssessmentType } from '@/types/database'
import { AlertTriangle, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react'
import { toast } from 'sonner'

type RiskLevel = 'low' | 'medium' | 'high'

const RISK_FACTORS = [
    { key: 'sleep_risk', label: 'Sleep' },
    { key: 'stress_risk', label: 'Stress' },
    { key: 'isolation_risk', label: 'Isolation' },
    { key: 'halt_risk', label: 'HALT' },
    { key: 'spirituality_risk', label: 'Spirituality' },
    { key: 'service_risk', label: 'Service' },
] as const

type RiskFactorKey = typeof RISK_FACTORS[number]['key']

const RISK_VALUES: RiskLevel[] = ['low', 'medium', 'high']

function getRiskColor(risk: RiskLevel | null): string {
    if (!risk) return 'bg-gray-100 text-gray-800'
    switch (risk) {
        case 'low':
            return 'bg-green-100 text-green-800'
        case 'medium':
            return 'bg-yellow-100 text-yellow-800'
        case 'high':
            return 'bg-red-100 text-red-800'
    }
}

function calculateOverallRisk(assessment: RelapseRiskAssessmentType | null): { score: number; level: RiskLevel } {
    if (!assessment) return { score: 0, level: 'low' }

    const riskScores = { low: 1, medium: 2, high: 3 }
    let total = 0
    let count = 0

    RISK_FACTORS.forEach(({ key }) => {
        const value = assessment[key]
        if (value) {
            total += riskScores[value]
            count++
        }
    })

    if (count === 0) return { score: 0, level: 'low' }

    const average = total / count
    const score = Math.round((average / 3) * 100)

    let level: RiskLevel = 'low'
    if (average >= 2.5) level = 'high'
    else if (average >= 1.75) level = 'medium'

    return { score, level }
}

export function RelapseRisk() {
    const [assessment, setAssessment] = useState<RelapseRiskAssessmentType | null>(null)
    const [weeklyHistory, setWeeklyHistory] = useState<RelapseRiskAssessmentType[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())
    const [notes, setNotes] = useState('')
    const supabase = createClient()

    useEffect(() => {
        loadAssessment()
        loadWeeklyHistory()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedDate])

    async function loadAssessment() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const dateStr = selectedDate.toISOString().split('T')[0]

        const { data, error } = await supabase
            .from('relapse_risk_assessments')
            .select('*')
            .eq('user_id', user.id)
            .eq('date', dateStr)
            .single()

        if (error && error.code === 'PGRST116') {
            const { data: newData, error: insertError } = await supabase
                .from('relapse_risk_assessments')
                .insert({
                    user_id: user.id,
                    date: dateStr,
                })
                .select()
                .single()

            if (!insertError && newData) {
                setAssessment(newData)
                setNotes(newData.notes || '')
            }
        } else if (data) {
            setAssessment(data)
            setNotes(data.notes || '')
        }
        setLoading(false)
    }

    async function loadWeeklyHistory() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const sevenDaysAgo = new Date(selectedDate)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
        const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0]
        const todayStr = selectedDate.toISOString().split('T')[0]

        const { data } = await supabase
            .from('relapse_risk_assessments')
            .select('*')
            .eq('user_id', user.id)
            .gte('date', sevenDaysAgoStr)
            .lte('date', todayStr)
            .order('date', { ascending: true })

        if (data) {
            setWeeklyHistory(data)
        }
    }

    async function updateRiskFactor(key: RiskFactorKey, value: RiskLevel) {
        if (!assessment) return

        const { error } = await supabase
            .from('relapse_risk_assessments')
            .update({ [key]: value })
            .eq('id', assessment.id)

        if (error) {
            toast.error('Failed to update risk factor')
            return
        }

        const updatedAssessment = { ...assessment, [key]: value }
        setAssessment(updatedAssessment)

        const { level } = calculateOverallRisk(updatedAssessment)
        if (level === 'high') {
            toast.error('High relapse risk detected! Consider reaching out to your support network.', {
                duration: 8000,
            })
        }
    }

    async function updateNotes() {
        if (!assessment) return

        const { error } = await supabase
            .from('relapse_risk_assessments')
            .update({ notes })
            .eq('id', assessment.id)

        if (error) {
            toast.error('Failed to update notes')
            return
        }

        setAssessment({ ...assessment, notes })
        toast.success('Notes saved')
    }

    function changeDate(days: number) {
        const newDate = new Date(selectedDate)
        newDate.setDate(newDate.getDate() + days)
        if (newDate <= new Date()) {
            setSelectedDate(newDate)
            setLoading(true)
        }
    }

    const isToday = selectedDate.toISOString().split('T')[0] === new Date().toISOString().split('T')[0]

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Relapse Risk Assessment
                    </CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const { score, level } = calculateOverallRisk(assessment)

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5" />
                            Relapse Risk Assessment
                        </CardTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changeDate(-1)}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-sm font-medium min-w-32 text-center">
                                {isToday ? 'Today' : selectedDate.toLocaleDateString()}
                            </span>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => changeDate(1)}
                                disabled={isToday}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                    <CardDescription>Daily quick assessment of relapse risk factors</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {RISK_FACTORS.map(({ key, label }) => (
                            <div key={key} className="space-y-2">
                                <label className="text-sm font-medium">{label}</label>
                                <div className="flex gap-2">
                                    {RISK_VALUES.map((riskLevel) => (
                                        <button
                                            key={riskLevel}
                                            onClick={() => updateRiskFactor(key, riskLevel)}
                                            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-all ${assessment?.[key] === riskLevel
                                                    ? getRiskColor(riskLevel)
                                                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                                                }`}
                                        >
                                            {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 border-t space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Overall Risk</h3>
                                <p className="text-sm text-muted-foreground">Based on all factors</p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{score}%</div>
                                <Badge className={getRiskColor(level)}>
                                    {level.toUpperCase()}
                                </Badge>
                            </div>
                        </div>

                        {level === 'high' && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <div className="flex gap-3">
                                    <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="font-semibold text-red-900">High Risk Alert</h4>
                                        <p className="text-sm text-red-800 mt-1">
                                            Your relapse risk is elevated. Consider:
                                        </p>
                                        <ul className="text-sm text-red-800 mt-2 space-y-1 list-disc list-inside">
                                            <li>Reaching out to your sponsor or support network</li>
                                            <li>Attending a meeting or connecting with your recovery community</li>
                                            <li>Reviewing your emergency action plan</li>
                                            <li>Practicing self-care and addressing immediate needs</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium">Notes</label>
                        <Textarea
                            placeholder="Add any notes about today's assessment..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onBlur={updateNotes}
                            rows={3}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5" />
                        Weekly History
                    </CardTitle>
                    <CardDescription>Risk levels over the past 7 days</CardDescription>
                </CardHeader>
                <CardContent>
                    {weeklyHistory.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No assessments recorded this week
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {weeklyHistory.map((item) => {
                                const { score: itemScore, level: itemLevel } = calculateOverallRisk(item)
                                const date = new Date(item.date)
                                const isItemToday = item.date === new Date().toISOString().split('T')[0]

                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between p-3 rounded-lg bg-gray-50"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="text-sm font-medium min-w-24">
                                                {isItemToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </div>
                                            <div className="flex gap-1">
                                                {RISK_FACTORS.map(({ key }) => (
                                                    <div
                                                        key={key}
                                                        className={`w-3 h-3 rounded-full ${getRiskColor(item[key])}`}
                                                        title={`${RISK_FACTORS.find(f => f.key === key)?.label}: ${item[key] || 'not set'}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm font-semibold">{itemScore}%</span>
                                            <Badge className={getRiskColor(itemLevel)}>
                                                {itemLevel.toUpperCase()}
                                            </Badge>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
