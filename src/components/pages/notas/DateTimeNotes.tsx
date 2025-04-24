'use client'

import * as React from 'react'
import { CalendarIcon } from '@radix-ui/react-icons'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'

interface DateTimeNotesProps {
  date: Date | '' | null
  setDate: React.Dispatch<React.SetStateAction<Date | '' | null>>
}

const DateTimeNotes: React.FC<DateTimeNotesProps> = ({
  date,
  setDate,
}: DateTimeNotesProps) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const hours = Array.from({ length: 24 }, (_, i) => i)
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5)

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const newDate = new Date(selectedDate)
      const currentDate = typeof date === 'string' ? new Date() : date
      newDate.setHours(currentDate instanceof Date ? currentDate.getHours() : 0)
      newDate.setMinutes(
        currentDate instanceof Date ? currentDate.getMinutes() : 0
      )
      newDate.setSeconds(0, 0)
      setDate(newDate)
    }
  }

  const handleTimeChange = (type: 'hour' | 'minute', value: number) => {
    if (date instanceof Date) {
      const newDate = new Date(date)
      if (type === 'hour') newDate.setHours(value)
      if (type === 'minute') newDate.setMinutes(value)
      setDate(newDate)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} modal>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          className={cn('w-full justify-between text-left font-normal')}>
          {date ? (
            format(date, 'MM/dd/yyyy HH:mm')
          ) : (
            <span>mm / dd / aaaa , hh:mm</span>
          )}
          <CalendarIcon className='ml-2 h-4 w-4' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <div className='sm:flex'>
          <Calendar
            mode='single'
            selected={date || undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
          <div className='flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x'>
            <ScrollArea className='w-64 sm:w-auto'>
              <div className='flex sm:flex-col p-2'>
                {hours.map((hour) => (
                  <Button
                    key={hour}
                    size='icon'
                    variant={
                      date instanceof Date && date.getHours() === hour
                        ? 'default'
                        : 'ghost'
                    }
                    className='sm:w-full shrink-0 aspect-square'
                    onClick={() => handleTimeChange('hour', hour)}>
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation='horizontal' className='sm:hidden' />
            </ScrollArea>
            <ScrollArea className='w-64 sm:w-auto'>
              <div className='flex sm:flex-col p-2'>
                {minutes.map((minute) => (
                  <Button
                    key={minute}
                    size='icon'
                    variant={
                      date instanceof Date && date.getMinutes() === minute
                        ? 'default'
                        : 'ghost'
                    }
                    className='sm:w-full shrink-0 aspect-square'
                    onClick={() => handleTimeChange('minute', minute)}>
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation='horizontal' className='sm:hidden' />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DateTimeNotes
