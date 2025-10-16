import { Entry } from '@/types/database'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, FileText, Zap } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface EntryCardProps {
  entry: Entry
}

export function EntryCard({ entry }: EntryCardProps) {
  const getEntryIcon = (type: string) => {
    switch (type) {
      case 'voice':
        return <Mic className="h-4 w-4" />
      case 'quick-check':
        return <Zap className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getEntryTypeLabel = (type: string) => {
    switch (type) {
      case 'voice':
        return 'Voice'
      case 'quick-check':
        return 'Quick Check'
      default:
        return 'Text'
    }
  }

  return (
  <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
  <CardHeader className="pb-3">
  <div className="flex items-center justify-between">
  <div className="flex items-center space-x-2">
  {getEntryIcon(entry.entry_type)}
  <Badge variant="secondary" className="text-xs bg-neutral-700 text-neutral-200 border-neutral-600">
  {getEntryTypeLabel(entry.entry_type)}
  </Badge>
  </div>
  <span className="text-xs text-neutral-400">
  {formatDistanceToNow(new Date(entry.created_at), { addSuffix: true })}
  </span>
  </div>
  </CardHeader>
  <CardContent>
  <p className="text-sm text-neutral-200 leading-relaxed">
  {entry.content}
  </p>
  </CardContent>
  </Card>
  )
}


