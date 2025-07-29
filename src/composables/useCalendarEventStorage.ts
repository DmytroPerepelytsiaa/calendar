import type { EventImpl } from '@fullcalendar/core/internal';

export function useCalendarEventStorage() {
  const getEvents = (): EventImpl[] => {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
  };

  const setEvents = (events: EventImpl[]) => {
    localStorage.setItem('events', JSON.stringify(events));
  };

  return {
    getEvents,
    setEvents,
  };
};
