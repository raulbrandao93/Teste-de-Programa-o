
import React, { useMemo } from 'react';

interface CalendarProps {
  selectedDates: Date[];
  onDateSelect: (date: Date) => void;
}

const Calendar: React.FC<CalendarProps> = ({ selectedDates, onDateSelect }) => {
  const year = 2024;
  const month = 10; // 0-indexed for November

  const calendarDays = useMemo(() => {
    const days = [];
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const startDayOfWeek = firstDayOfMonth.getDay(); // 0 (Sun) to 6 (Sat)
    const totalDays = lastDayOfMonth.getDate();

    // Add empty cells for days before the 1st of the month
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [year, month]);

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg border border-slate-200 dark:border-slate-600">
      <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-slate-500 dark:text-slate-300 mb-3">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (!day) {
            return <div key={`empty-${index}`} className="w-10 h-10"></div>;
          }

          const isSelected = selectedDates.some(d => d.getTime() === day.getTime());
          const isToday = new Date().toDateString() === day.toDateString();

          const baseClasses = "w-10 h-10 flex items-center justify-center rounded-full text-sm cursor-pointer transition-colors duration-150";
          
          let dayClasses = baseClasses;

          if (isSelected) {
            dayClasses += ' bg-purple-600 text-white font-bold hover:bg-purple-700';
          } else {
            dayClasses += ' text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600';
            if (isToday) {
                dayClasses += ' ring-2 ring-purple-500';
            }
          }

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateSelect(day)}
              className={dayClasses}
            >
              {day.getDate()}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
