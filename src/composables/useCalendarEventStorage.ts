import type { CalendarEventSavePayload } from '@/types';

export function useCalendarEventStorage() {
  const getEvents = (): CalendarEventSavePayload[] => {
    const events = localStorage.getItem('events');
    return events ? JSON.parse(events) : [];
  };

  const addEvent = (event: CalendarEventSavePayload) => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  };

  const updateEvent = (updatedEvent: CalendarEventSavePayload) => {
    const events = getEvents();
    const eventIndex = events.findIndex(event => event.id === updatedEvent.id);
    events[eventIndex] = updatedEvent;
    localStorage.setItem('events', JSON.stringify(events));
  }

  const deleteEvent = (eventId: string) => {
    const events = getEvents();
    const updatedEvents = events.filter(event => event.id !== eventId);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
  }

  return {
    getEvents,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};
