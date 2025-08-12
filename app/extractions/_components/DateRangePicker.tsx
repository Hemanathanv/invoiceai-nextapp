"use client"

import { useState } from "react"
import { format, subDays, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isSameDay } from "date-fns"
import { CalendarIcon, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { DateRange } from "react-day-picker"

interface DateRangePickerProps {
  value: { from: Date; to: Date }
  onChange: (range: { from: Date; to: Date }) => void
}

type PresetRange = {
  label: string
  value: string
  getRange: () => { from: Date; to: Date }
}

const presetRanges: PresetRange[] = [
  {
    label: "Today",
    value: "today",
    getRange: () => ({
      from: startOfDay(new Date()),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "2 Days",
    value: "2days",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 1)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "7 Days",
    value: "7days",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 6)),
      to: endOfDay(new Date()),
    }),
  },
  {
    label: "This Week",
    value: "week",
    getRange: () => ({
      from: startOfWeek(new Date(), { weekStartsOn: 1 }), // Monday start
      to: endOfWeek(new Date(), { weekStartsOn: 1 }),
    }),
  },
  {
    label: "This Month",
    value: "month",
    getRange: () => ({
      from: startOfMonth(new Date()),
      to: endOfMonth(new Date()),
    }),
  },
  {
    label: "30 Days",
    value: "30days",
    getRange: () => ({
      from: startOfDay(subDays(new Date(), 29)),
      to: endOfDay(new Date()),
    }),
  },
]

export function DateRangePicker({   value ,
  onChange }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)
  const [manualSelection, setManualSelection] = useState<{
    from: Date | null
    to: Date | null
    selectingEnd: boolean
  }>({
    from: null,
    to: null,
    selectingEnd: false,
  })

  // Check if current range matches any preset
  const getCurrentPreset = () => {
    for (const preset of presetRanges) {
      const { from: pFrom, to: pTo } = preset.getRange()
      if (
        isSameDay(value.from, pFrom) &&
        isSameDay(value.to,   pTo)
      ) {
        return preset.value
      }
    }
    return null
  }
  

  

  const handlePresetSelect = (preset: PresetRange) => {
    const range = preset.getRange()
    onChange(range)
    setSelectedPreset(preset.value)
    setManualSelection({ from: null, to: null, selectingEnd: false })
    setIsOpen(false)
  }

  const handleCalendarSelect = (range: DateRange | undefined) => {
    if (!range) return
    
    // If we have both from and to dates from the calendar (drag selection)
    if (range.from && range.to) {
      onChange({
        from: startOfDay(range.from),
        to: endOfDay(range.to),
      })
      setManualSelection({ from: null, to: null, selectingEnd: false })
      setSelectedPreset(null)
      setIsOpen(false)
      return
    }

    // If we only have a from date (single click)
    if (range.from && !range.to) {
      // If we're not currently selecting or if the new date is different from current start date
      if (
        !manualSelection.selectingEnd ||
        !manualSelection.from ||
        range.from.getTime() !== manualSelection.from.getTime()
      ) {
        // Start new selection
        setManualSelection({
          from: startOfDay(range.from),
          to: null,
          selectingEnd: true,
        })
        setSelectedPreset(null)
      } else if (manualSelection.selectingEnd && manualSelection.from) {
        // Second click - complete the range
        const from = manualSelection.from
        const to = endOfDay(range.from)

        // Ensure from is before to
        if (from <= to) {
          onChange({ from, to })
        } else {
          // If end date is before start date, swap them
          onChange({ from: startOfDay(range.from), to: endOfDay(from) })
        }

        setManualSelection({ from: null, to: null, selectingEnd: false })
        setSelectedPreset(null)
        setIsOpen(false)
      }
    }
  }

  const resetManualSelection = () => {
    setManualSelection({ from: null, to: null, selectingEnd: false })
  }

  const formatDateRange = () => {
    if (value?.from && value?.to) {
      if (format(value.from, "yyyy-MM-dd") === format(value.to, "yyyy-MM-dd")) {
        return format(value.from, "MMM dd, yyyy")
      }
      return `${format(value.from, "MMM dd")} - ${format(value.to, "MMM dd, yyyy")}`
    }
    return "Select date range"
  }

  const currentPreset = getCurrentPreset()

  const displayedPreset = selectedPreset ?? currentPreset

  // Determine what to show in the calendar
  const calendarSelected = () => {
    if (manualSelection.from && !manualSelection.to) {
      // Show only start date while waiting for end date
      return { from: manualSelection.from, to: undefined }
    } else if (manualSelection.from && manualSelection.to) {
      // Show complete manual selection
      return { from: manualSelection.from, to: manualSelection.to }
    } else {
      // Show current value
      return { from: value?.from, to: value?.to }
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[280px] justify-start text-left font-normal", !value && "text-muted-foreground")}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDateRange()}
          {displayedPreset && (
            <Badge variant="secondary" className="ml-2 text-sm">
              {presetRanges.find((p) => p.value === displayedPreset)?.label}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
  <div className="flex">
    {/* Quick Select Panel */}
    <div className="border-r px-3 py-4 space-y-2 min-w-[120px] max-w-[140px]">
      <div className="text-xs font-semibold text-gray-700 mb-1">Quick Select</div>
      {presetRanges.map((preset) => (
        <Button
          key={preset.value}
          variant="ghost"
          size="sm"
          className={cn(
            "w-full h-2 justify-start text-left text-xs py-1 px-1.5",
            displayedPreset === preset.value && "bg-blue-50 text-blue-700",
          )}
          onClick={() => handlePresetSelect(preset)}
        >
          {displayedPreset === preset.value && <Check className="mr-2 h-3 w-3" />}
          {preset.label}
        </Button>
      ))}
      <div className="pt-2 border-t">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-left text-xs py-1 px-1.5 text-gray-600"
          onClick={resetManualSelection}
        >
          Custom Range
        </Button>
      </div>
    </div>

    {/* Calendar Panel */}
    <div className="p-4 w-full">
      <div className="mb-3">
        <div className="flex items-center justify-between">
          <div className="text-sm font-medium text-gray-700">Custom Range</div>
          {manualSelection.selectingEnd && (
            <Button
              variant="ghost"
              size="sm"
              onClick={resetManualSelection}
              className="h-2 px-2 text-xs text-gray-500 hover:text-gray-700"
            >
              <RotateCcw className="h-2 w-2 mr-1" />
              Reset
            </Button>
          )}
        </div>
        {manualSelection.from && !manualSelection.to && (
          <div className="text-xs text-blue-600 mt-1 w-full">
            Start: {format(manualSelection.from, "MMM dd, yyyy")} – Click end date
          </div>
        )}
        {manualSelection.from && manualSelection.to && (
          <div className="text-xs text-green-600 mt-1">
            {format(manualSelection.from, "MMM dd")} – {format(manualSelection.to, "MMM dd, yyyy")}
          </div>
        )}
      </div>

      <Calendar
        mode="range"
        defaultMonth={value?.from}
        selected={calendarSelected()}
        onSelect={handleCalendarSelect}
        numberOfMonths={2}
        className="rounded-md"
      />

      {manualSelection.from && manualSelection.selectingEnd && (
        <div className="mt-2 p-2 bg-blue-50 rounded text-xs text-blue-700">
          💡 Click on the end date to complete selection, or click a new start date to restart
        </div>
      )}
    </div>
  </div>
</PopoverContent>

    </Popover>
  )
}
