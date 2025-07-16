import { format, isToday, startOfDay, endOfDay } from 'date-fns';

export const formatTime = (date) => {
  return format(date, 'HH:mm');
};

export const getLocalDateTime = () => {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  const localDate = new Date(now.getTime() - offset * 60000);
  return localDate.toISOString().slice(0, 16);
};

export const formatDate = (date) => {
  return format(date, 'MMM dd, yyyy');
};

export const getTimeOfDay = (date) => {
  const hour = date.getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
};

export const isWithinToday = (date) => {
  return isToday(date);
};

export const getTodayRange = () => {
  const today = new Date();
  return {
    start: startOfDay(today),
    end: endOfDay(today)
  };
};

export const filterByTimeOfDay = (
  data, 
  timeOfDay
) => {
  if (timeOfDay === 'all') return data;
  
  return data.filter(item => {
    const itemTimeOfDay = getTimeOfDay(item.timestamp);
    return itemTimeOfDay === timeOfDay;
  });
};