'use client'

import { useState } from 'react'
import { CheckInForm } from '@/components/check-in-form'
import { TodaysEntries } from '@/components/todays-entries'
import { EmergencyCard } from '@/components/emergency-card'
import { CravingModal } from '@/components/craving-modal'
import { DailyChecklist } from '@/components/daily-checklist'
import { DailyMetrics } from '@/components/daily-metrics'
import { IfThenPlans } from '@/components/if-then-plans'
import { ExercisesList } from '@/components/exercises-list'
import { TriggersTracker } from '@/components/triggers-tracker'
import { ServiceRoster } from '@/components/service-roster'
import { AIAdvisor } from '@/components/ai-advisor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon, Flame } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomDayButtonProps {
  day: {
    date: Date
  }
  modifiers: {
    today?: boolean
    selected?: boolean
    range_start?: boolean
    range_end?: boolean
    range_middle?: boolean
    focused?: boolean
    [key: string]: boolean | undefined
  }
  className?: string
  children?: React.ReactNode
}

function CustomDayButton({ day, ...props }: CustomDayButtonProps) {
  const isToday = day.date.toDateString() === new Date().toDateString()
  return (
    <Button
      {...props}
      className={cn(
        props.className,
        isToday && "bg-primary text-primary-foreground font-bold ring-2 ring-primary/30 border border-primary/20 shadow-lg p-1 transform scale-105 z-10"
      )}
    >
      {day.date.getDate()}
    </Button>
  )
}

export default function DashboardPage() {
  const [showCravingModal, setShowCravingModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

return (
<div className="space-y-8">
<div className="flex items-start justify-between">
<div>
<h1 className="text-3xl font-bold text-foreground">Today&apos;s Journey</h1>
<p className="text-muted-foreground mt-2">
  Track your progress in growing humility today
  </p>
</div>
<Button
onClick={() => setShowCravingModal(true)}
variant="destructive"
size="lg"
  className="flex-shrink-0"
>
<Flame className="h-5 w-5 mr-2" />
  Having a Craving?
  </Button>
      </div>

      {/* Removed debug banner */}

      <AIAdvisor />

<div className="grid gap-8 lg:grid-cols-2">
  <div className="space-y-8">
    <Card>
    <CardHeader>
        <CardTitle>New Entry</CardTitle>
    <CardDescription>
      How are you growing in humility today?
      </CardDescription>
      </CardHeader>
  <CardContent>
   <CheckInForm />
  </CardContent>
          </Card>

    <Card>
    <CardHeader>
    <CardTitle className="flex items-center gap-2">
    <CalendarIcon className="h-5 w-5" />
    Select Date
    </CardTitle>
    </CardHeader>
            <CardContent className="flex justify-center">
          <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          classNames={{
          months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
          month: "space-y-4",
          caption: "flex justify-center pt-1 relative items-center",
          caption_label: "text-sm font-medium",
          nav: "space-x-1 flex items-center",
          nav_button: "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 rounded-full",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-muted-foreground rounded-md w-10 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-accent rounded-md",
          day_selected: "bg-primary text-primary-foreground rounded-md",
          day_outside: "text-muted-foreground opacity-50",
          day_disabled: "text-muted-foreground opacity-50",
          day_range_middle: "aria-selected:bg-accent",
          day_hidden: "invisible",
          }}
          components={{
            DayButton: CustomDayButton,
          }}
          />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Entries</CardTitle>
            <CardDescription>
              Your reflections from the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TodaysEntries selectedDate={selectedDate} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <DailyChecklist />
        <DailyMetrics />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <IfThenPlans />
        <ExercisesList />
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
      <TriggersTracker />
      <ServiceRoster />
      </div>

      <EmergencyCard />

      <CravingModal open={showCravingModal} onOpenChange={setShowCravingModal} />
    </div>
  )
}
