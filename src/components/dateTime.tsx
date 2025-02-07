"use client";
 
import * as React from "react";
import { CalendarIcon } from "@radix-ui/react-icons"
import { format } from "date-fns";
 
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import Swal from 'sweetalert2'
import { useEffect } from "react";


interface DateTimeListProps {
  setDate: React.Dispatch<React.SetStateAction<Date | "">> ;
  date: Date | "";
}

const blue500="#2b7fff"
const DateTime:React.FC<DateTimeListProps> = ({date, setDate})=> {
  const [isOpen, setIsOpen] = React.useState(false);
   const today = new Date();
    today.setSeconds(0, 0); 
    const now = today.getTime(); 
   const hours = Array.from({ length: 24 }, (_, i) => i);
   
  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };
 
  const handleTimeChange = (
    type: "hour" | "minute",
    value: string
  ) => {
    if (date) {
      const newDate = new Date(date);
      if (type === "hour") {
        newDate.setHours(parseInt(value));
      } else if (type === "minute") {
        newDate.setMinutes(parseInt(value));
      }
      if (newDate.getTime() <= now) {
        Swal.fire({
          icon: "error",
          title:"Error",
          text: "Por favor, seleccione una hora futura.",
          confirmButtonColor:blue500,
        });
      } else {
        setDate(newDate);
      }
    }

  };
  const isDateDisabled = (date: Date) => {
    const today = new Date();
    const selectedDate = new Date(date);
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    return selectedDate.getTime() < today.getTime();
  };

  useEffect(()=>{
    console.log("ESTA ABIERTO",isOpen)

  },[isOpen])

  const handlePopoverToggle = () => {
    setIsOpen((prevState) => !prevState); // Alternar entre abierto y cerrado
  };
  
  return (
    <Popover open={isOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-between text-left font-normal",
            !date && ""
          )}
          onClick={handlePopoverToggle}
        >
          {date ? (
            format(date, "MM/dd/yyyy hh:mm")
          ) : (
            <span>mm / dd / aaaa ,  hh:mm</span>
          )}
          <CalendarIcon className="mr-2 h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <div className="sm:flex">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={isDateDisabled}
          />
          <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {hours.reverse().map((hour) => (
                  <Button
                    key={hour}
                    size="icon"
                    variant={date && date.getHours() === hour ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("hour", hour.toString())}
                  >
                    {hour}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
            <ScrollArea className="w-64 sm:w-auto">
              <div className="flex sm:flex-col p-2">
                {Array.from({ length: 12 }, (_, i) => i * 5).map((minute) => (
                  <Button
                    key={minute}
                    size="icon"
                    variant={date && date.getMinutes() === minute ? "default" : "ghost"}
                    className="sm:w-full shrink-0 aspect-square"
                    onClick={() => handleTimeChange("minute", minute.toString())}
                  >
                    {minute.toString().padStart(2, '0')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" className="sm:hidden" />
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
export default DateTime;