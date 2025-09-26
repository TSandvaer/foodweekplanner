import {
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  format,
  isToday,
  isSameWeek
} from 'date-fns';

export const getWeekStart = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 }); // Monday
};

export const getWeekEnd = (date: Date): Date => {
  return endOfWeek(date, { weekStartsOn: 1 }); // Sunday
};

export const getWeekDays = (weekStart: Date): Date[] => {
  const days: Date[] = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(weekStart);
    day.setDate(weekStart.getDate() + i);
    days.push(day);
  }
  return days;
};

export const navigateWeek = (currentDate: Date, direction: 'prev' | 'next'): Date => {
  return direction === 'next' ? addWeeks(currentDate, 1) : subWeeks(currentDate, 1);
};

export const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = getWeekEnd(weekStart);
  return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
};

export const formatDate = (date: Date, formatStr: string = 'yyyy-MM-dd'): string => {
  return format(date, formatStr);
};

export const isCurrentWeek = (date: Date): boolean => {
  return isSameWeek(date, new Date(), { weekStartsOn: 1 });
};

export const isDayToday = (date: Date): boolean => {
  return isToday(date);
};

export const getDayName = (date: Date): string => {
  return format(date, 'EEEE');
};

export const getShortDayName = (date: Date): string => {
  return format(date, 'EEE');
};