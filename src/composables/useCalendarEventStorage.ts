export function useCalendarEventStorage() {
  const getEvents = () => {
    return JSON.parse(localStorage.getItem('events')) ?? [];
  };

  const addEvent = (event) => {
    const events = getEvents();
    events.push(event);
    localStorage.setItem('events', JSON.stringify(events));
  };

  return {
    getEvents,
    addEvent,
  };
};
