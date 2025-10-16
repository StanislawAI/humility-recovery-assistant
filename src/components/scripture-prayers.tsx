'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { createClient } from '@/lib/supabase/client'
import { BookOpen, Plus, Star, Copy, Search, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

type ScripturePrayer = {
    id: string
    user_id: string
    title: string
    reference: string
    content: string
    type: 'scripture' | 'prayer' | 'meditation'
    favorite: boolean
    times_accessed: number
    created_at: string
}

const DEFAULT_ENTRIES = [
    {
        title: 'Armor of God',
        reference: 'Ephesians 6:10–18',
        content: 'Finally, be strong in the Lord and in his mighty power. Put on the full armor of God, so that you can take your stand against the devil\'s schemes. For our struggle is not against flesh and blood, but against the rulers, against the authorities, against the powers of this dark world and against the spiritual forces of evil in the heavenly realms. Therefore put on the full armor of God, so that when the day of evil comes, you may be able to stand your ground, and after you have done everything, to stand. Stand firm then, with the belt of truth buckled around your waist, with the breastplate of righteousness in place, and with your feet fitted with the readiness that comes from the gospel of peace. In addition to all this, take up the shield of faith, with which you can extinguish all the flaming arrows of the evil one. Take the helmet of salvation and the sword of the Spirit, which is the word of God. And pray in the Spirit on all occasions with all kinds of prayers and requests. With this in mind, be alert and always keep on praying for all the Lord\'s people.',
        type: 'scripture' as const,
    },
    {
        title: 'Sober Vigilance',
        reference: '1 Peter 5:8',
        content: 'Be alert and of sober mind. Your enemy the devil prowls around like a roaring lion looking for someone to devour.',
        type: 'scripture' as const,
    },
    {
        title: 'Angel of Light',
        reference: '2 Corinthians 11:14',
        content: 'And no wonder, for Satan himself masquerades as an angel of light. It is not surprising, then, if his servants also masquerade as servants of righteousness. Their end will be what their actions deserve.',
        type: 'scripture' as const,
    },
    {
        title: 'Thou Art With Me',
        reference: 'Psalm 23',
        content: 'The Lord is my shepherd, I lack nothing. He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul. He guides me along the right paths for his name\'s sake. Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me. You prepare a table before me in the presence of my enemies. You anoint my head with oil; my cup overflows. Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.',
        type: 'scripture' as const,
    },
    {
        title: 'Suffering Producing Hope',
        reference: 'Romans 5:3–5',
        content: 'Not only so, but we also glory in our sufferings, because we know that suffering produces perseverance; perseverance, character; and character, hope. And hope does not put us to shame, because God\'s love has been poured out into our hearts through the Holy Spirit, who has been given to us.',
        type: 'scripture' as const,
    },
    {
        title: 'Rest in Christ',
        reference: 'Matthew 11:28–30',
        content: 'Come to me, all you who are weary and burdened, and I will give you rest. Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls. For my yoke is easy and my burden is light.',
        type: 'scripture' as const,
    },
    {
        title: 'Serenity Prayer',
        reference: 'Reinhold Niebuhr',
        content: 'God, grant me the serenity to accept the things I cannot change, courage to change the things I can, and wisdom to know the difference. Living one day at a time, enjoying one moment at a time, accepting hardships as the pathway to peace. Taking, as He did, this sinful world as it is, not as I would have it. Trusting that He will make all things right if I surrender to His Will, that I may be reasonably happy in this life and supremely happy with Him forever in the next. Amen.',
        type: 'prayer' as const,
    },
    {
        title: 'Jesus Prayer',
        reference: 'Eastern Orthodox tradition',
        content: 'Lord Jesus Christ, Son of God, have mercy on me, a sinner.',
        type: 'prayer' as const,
    },
    {
        title: 'Abandonment Prayer',
        reference: 'Charles de Foucauld',
        content: 'Father, I abandon myself into your hands; do with me what you will. Whatever you may do, I thank you: I am ready for all, I accept all. Let only your will be done in me, and in all your creatures. I wish no more than this, O Lord. Into your hands I commend my soul; I offer it to you with all the love of my heart, for I love you, Lord, and so need to give myself, to surrender myself into your hands, without reserve, and with boundless confidence, for you are my Father.',
        type: 'prayer' as const,
    },
]

export function ScripturePrayers() {
    const [entries, setEntries] = useState<ScripturePrayer[]>([])
    const [filteredEntries, setFilteredEntries] = useState<ScripturePrayer[]>([])
    const [selectedEntry, setSelectedEntry] = useState<ScripturePrayer | null>(null)
    const [showDialog, setShowDialog] = useState(false)
    const [showAddDialog, setShowAddDialog] = useState(false)
    const [showDefaults, setShowDefaults] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [filterType, setFilterType] = useState<'all' | 'scripture' | 'prayer' | 'meditation'>('all')
    const [newTitle, setNewTitle] = useState('')
    const [newReference, setNewReference] = useState('')
    const [newContent, setNewContent] = useState('')
    const [newType, setNewType] = useState<'scripture' | 'prayer' | 'meditation'>('scripture')
    const [loading, setLoading] = useState(true)
    const supabase = createClient()

    useEffect(() => {
        loadEntries()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        filterEntries()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entries, searchQuery, filterType])

    async function loadEntries() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { data } = await supabase
            .from('scripture_prayers')
            .select('*')
            .eq('user_id', user.id)
            .order('favorite', { ascending: false })
            .order('times_accessed', { ascending: false })

        if (data) {
            setEntries(data)
            if (data.length === 0) {
                setShowDefaults(true)
            }
        }
        setLoading(false)
    }

    function filterEntries() {
        let filtered = entries

        if (filterType !== 'all') {
            filtered = filtered.filter(e => e.type === filterType)
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                e =>
                    e.title.toLowerCase().includes(query) ||
                    e.reference.toLowerCase().includes(query) ||
                    e.content.toLowerCase().includes(query)
            )
        }

        setFilteredEntries(filtered)
    }

    async function addAllDefaults() {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('scripture_prayers')
            .insert(
                DEFAULT_ENTRIES.map(entry => ({
                    user_id: user.id,
                    title: entry.title,
                    reference: entry.reference,
                    content: entry.content,
                    type: entry.type,
                    favorite: false,
                    times_accessed: 0,
                }))
            )

        if (error) {
            toast.error('Failed to add defaults')
            return
        }

        toast.success('Defaults added!')
        setShowDefaults(false)
        loadEntries()
    }

    async function addEntry() {
        if (!newTitle || !newContent) {
            toast.error('Title and content are required')
            return
        }

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const { error } = await supabase
            .from('scripture_prayers')
            .insert({
                user_id: user.id,
                title: newTitle,
                reference: newReference,
                content: newContent,
                type: newType,
                favorite: false,
                times_accessed: 0,
            })

        if (error) {
            toast.error('Failed to add entry')
            return
        }

        toast.success('Entry added!')
        setNewTitle('')
        setNewReference('')
        setNewContent('')
        setNewType('scripture')
        setShowAddDialog(false)
        loadEntries()
    }

    async function openEntry(entry: ScripturePrayer) {
        setSelectedEntry(entry)
        setShowDialog(true)

        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        await supabase
            .from('scripture_prayers')
            .update({ times_accessed: entry.times_accessed + 1 })
            .eq('id', entry.id)

        setEntries(entries.map(e => e.id === entry.id ? { ...e, times_accessed: e.times_accessed + 1 } : e))
    }

    async function toggleFavorite(entry: ScripturePrayer) {
        const { error } = await supabase
            .from('scripture_prayers')
            .update({ favorite: !entry.favorite })
            .eq('id', entry.id)

        if (error) {
            toast.error('Failed to update favorite')
            return
        }

        setEntries(entries.map(e => e.id === entry.id ? { ...e, favorite: !e.favorite } : e))
        if (selectedEntry?.id === entry.id) {
            setSelectedEntry({ ...entry, favorite: !entry.favorite })
        }
    }

    async function copyToClipboard(content: string) {
        try {
            await navigator.clipboard.writeText(content)
            toast.success('Copied to clipboard!')
        } catch {
            toast.error('Failed to copy')
        }
    }

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Scripture & Prayers
                    </CardTitle>
                    <CardDescription>Loading...</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <>
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <BookOpen className="h-5 w-5" />
                                Scripture & Prayers
                            </CardTitle>
                            <CardDescription>Spiritual resources for strength and peace</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => setShowAddDialog(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    {showDefaults && (
                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg space-y-2">
                            <div className="flex items-start gap-2">
                                <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-blue-900">Get started with default resources</p>
                                    <p className="text-sm text-blue-700">Scripture passages and prayers from your recovery plan.</p>
                                </div>
                            </div>
                            <Button size="sm" onClick={addAllDefaults} className="w-full">
                                Add All Defaults
                            </Button>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Search by title, reference, or content..."
                                className="pl-9"
                            />
                        </div>

                        <Tabs value={filterType} onValueChange={(v) => setFilterType(v as typeof filterType)}>
                            <TabsList className="w-full">
                                <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                                <TabsTrigger value="scripture" className="flex-1">Scripture</TabsTrigger>
                                <TabsTrigger value="prayer" className="flex-1">Prayer</TabsTrigger>
                                <TabsTrigger value="meditation" className="flex-1">Meditation</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {filteredEntries.length === 0 && !showDefaults && (
                        <p className="text-sm text-muted-foreground text-center py-8">
                            {searchQuery || filterType !== 'all' ? 'No matches found.' : 'No entries yet. Add your first one.'}
                        </p>
                    )}

                    <div className="space-y-2">
                        {filteredEntries.map((entry) => (
                            <button
                                key={entry.id}
                                onClick={() => openEntry(entry)}
                                className="w-full text-left p-3 rounded-lg border hover:bg-muted transition-colors"
                            >
                                <div className="flex items-start justify-between gap-2">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-medium">{entry.title}</h4>
                                            {entry.favorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
                                        </div>
                                        <p className="text-sm text-muted-foreground">{entry.reference}</p>
                                    </div>
                                    <Badge variant="outline" className="capitalize">
                                        {entry.type}
                                    </Badge>
                                </div>
                                {entry.times_accessed > 0 && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Accessed {entry.times_accessed} {entry.times_accessed === 1 ? 'time' : 'times'}
                                    </p>
                                )}
                            </button>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Dialog open={showDialog} onOpenChange={setShowDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <DialogTitle>{selectedEntry?.title}</DialogTitle>
                                <DialogDescription>{selectedEntry?.reference}</DialogDescription>
                            </div>
                            <Badge variant="outline" className="capitalize">
                                {selectedEntry?.type}
                            </Badge>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm whitespace-pre-line leading-relaxed">{selectedEntry?.content}</p>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                onClick={() => selectedEntry && toggleFavorite(selectedEntry)}
                                className="flex-1"
                            >
                                <Star className={`h-4 w-4 mr-2 ${selectedEntry?.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                                {selectedEntry?.favorite ? 'Unfavorite' : 'Favorite'}
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => selectedEntry && copyToClipboard(selectedEntry.content)}
                                className="flex-1"
                            >
                                <Copy className="h-4 w-4 mr-2" />
                                Copy
                            </Button>
                        </div>
                        <Button onClick={() => setShowDialog(false)} className="w-full">
                            Close
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add Scripture, Prayer, or Meditation</DialogTitle>
                        <DialogDescription>
                            Add a new spiritual resource to your collection
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm font-medium">Type</label>
                            <Tabs value={newType} onValueChange={(v) => setNewType(v as typeof newType)}>
                                <TabsList className="w-full">
                                    <TabsTrigger value="scripture" className="flex-1">Scripture</TabsTrigger>
                                    <TabsTrigger value="prayer" className="flex-1">Prayer</TabsTrigger>
                                    <TabsTrigger value="meditation" className="flex-1">Meditation</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                        <div>
                            <label className="text-sm font-medium">Title *</label>
                            <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="e.g., Armor of God"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Reference</label>
                            <Input
                                value={newReference}
                                onChange={(e) => setNewReference(e.target.value)}
                                placeholder="e.g., Ephesians 6:10-18"
                            />
                        </div>
                        <div>
                            <label className="text-sm font-medium">Content *</label>
                            <Textarea
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                placeholder="Enter the full text..."
                                rows={8}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1">
                                Cancel
                            </Button>
                            <Button onClick={addEntry} className="flex-1" disabled={!newTitle || !newContent}>
                                Add Entry
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
