import { CalendarDays } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { catalogoFechas } from '@/lib/utils'
import React from 'react'
import DateTimeNotes from './DateTimeNotes'

interface DateFilterProps {
  dateFilter: string
  setDateFilter: (value: string) => void
  Filter: () => void
  setDate1: React.Dispatch<React.SetStateAction<Date | '' | null>>
  setDate2: React.Dispatch<React.SetStateAction<Date | '' | null>>
  date1: Date | '' | null
  date2: Date | '' | null
}

const DateFilter = ({
  dateFilter,
  setDateFilter,
  Filter,
  setDate1,
  setDate2,
  date1,
  date2,
}: DateFilterProps) => {
  return (
    <>
      {dateFilter == 'range' ? (
        <div className='flex items-center gap-2 mr-14'>
          <DateTimeNotes date={date1} setDate={setDate1} />
          <DateTimeNotes date={date2} setDate={setDate2} />
          <Button
            type='button'
            className={'bg-blue-500 hover:bg-blue-600'}
            onClick={Filter}>
            {' '}
            Filtrar
          </Button>
        </div>
      ) : null}
      <div className='flex items-center w-48 gap-2'>
        <Select
          value={dateFilter}
          onValueChange={(value: string) => {
            setDateFilter(value)
          }}>
          <SelectTrigger className='w-full'>
            <SelectValue placeholder='Selecciona un filtro de fecha' />
            <CalendarDays className='ml-auto h-4 w-4 opacity-70' />
          </SelectTrigger>
          <SelectContent>
            {catalogoFechas().map((option: any) => {
              return (
                <SelectItem key={option.key} value={option.key}>
                  {option.label}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
        {/* <CalendarDays /> */}
      </div>
    </>
  )
}

export default DateFilter
