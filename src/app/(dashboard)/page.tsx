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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomDayButton({ day, ...props }: any) {
  const isToday = day.date.toDateString() === new Date().toDateString()
return (
<Button
{...props}
className={cn(
props.className,
  isToday && "bg-blue-500 text-white font-bold ring-4 ring-blue-300 ring-opacity-90 border-2 border-blue-100 shadow-xl p-1 transform scale-105 z-10"
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
<h1 className="text-3xl font-bold text-white">Today&apos;s Journey</h1>
<p className="text-gray-300 mt-2">
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

      <EmergencyCard />

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

    <Card className="bg-neutral-900/40 border-neutral-700 text-neutral-100">
    <CardHeader>
      <CardTitle className="flex items-center gap-2 text-neutral-50">
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
          caption_label: "text-sm font-medium text-neutral-100",
          nav: "space-x-1 flex items-center",
          nav_button: "h-10 w-10 bg-transparent p-0 opacity-50 hover:opacity-100 text-neutral-300 hover:text-neutral-100 rounded-full hover:bg-neutral-700",
          nav_button_previous: "absolute left-1",
          nav_button_next: "absolute right-1",
          table: "w-full border-collapse space-y-1",
          head_row: "flex",
          head_cell: "text-neutral-400 rounded-md w-10 font-normal text-[0.8rem]",
          row: "flex w-full mt-2",
          cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-neutral-700 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: "h-10 w-10 p-0 font-normal aria-selected:opacity-100 hover:bg-neutral-700 hover:text-neutral-100 focus:bg-neutral-700 focus:text-neutral-100 rounded-full",
          day_selected: "bg-neutral-600 text-neutral-100 hover:bg-neutral-600 hover:text-neutral-100 focus:bg-neutral-600 focus:text-neutral-100",
          day_outside: "text-neutral-500 opacity-50",
          day_disabled: "text-neutral-500 opacity-50",
          day_range_middle: "aria-selected:bg-neutral-700 aria-selected:text-neutral-100",
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

      <CravingModal open={showCravingModal} onOpenChange={setShowCravingModal} />
    </div>
  )
}
