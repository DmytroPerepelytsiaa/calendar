<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarApi, CalendarOptions, DateSelectArg, EventApi, EventClickArg } from '@fullcalendar/core';
import type { EventImpl } from '@fullcalendar/core/internal';
import { VueFinalModal } from 'vue-final-modal';
import { ref } from 'vue';
import { onMounted } from 'vue';
import 'vue-final-modal/style.css';

import { CALENDAR_OPTIONS } from './constants';
import { useCalendarEventStorage } from './composables';
import type { CalendarEventSavePayload } from './types';
import CalendarEventEditModal from './components/CalendarEventEditModal.vue';
import './assets/main.scss';

let calendarApi: CalendarApi | null = null;
const showModal = ref(false);
const selectedDate = ref<DateSelectArg | EventApi | null>(null);
const calendarRef = ref<typeof FullCalendar | null>(null);
const { getEvents, setEvents } = useCalendarEventStorage();

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  if (calendarApi) {
    calendarApi.unselect();
  }

  selectedDate.value = selectInfo;
  showModal.value = true;

};

const handleEventSave = (event: CalendarEventSavePayload): void => {
  if (calendarApi) {
    calendarApi.addEvent(event);
  }

  showModal.value = false;
  selectedDate.value = null;
};

const handleEventEdit = (event: Partial<EventApi>): void => {
  let eventInCalendar: EventApi | null = null;

  if (calendarApi && event.id) {
    eventInCalendar = calendarApi.getEventById(event.id);
  }

  if (eventInCalendar && event.start && event.end) {
    eventInCalendar.setProp('title', event.title);
    eventInCalendar.setStart(event.start);
    eventInCalendar.setEnd(event.end);
  }

  showModal.value = false;
  selectedDate.value = null;
};

const handleEventDelete = (): void => {
  const event = selectedDate.value as EventApi;
  event?.remove();
  selectedDate.value = null;
  showModal.value = false;
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const event = clickInfo.event;
  selectedDate.value = event;
  showModal.value = true;
};

const handleEvents = (events: EventImpl[]) => {
  setEvents(events);
};

const calendarOptions = { ...CALENDAR_OPTIONS, initialEvents: getEvents(), select: handleDateSelect, eventClick: handleEventClick, eventsSet: handleEvents } as unknown as CalendarOptions;

onMounted(() => {
  if (calendarRef.value) {
    calendarApi = calendarRef.value.getApi();
  }
});
</script>

<template>
  <FullCalendar ref="calendarRef" :options="calendarOptions"></FullCalendar>

  <VueFinalModal v-model="showModal" :esc-to-close="true" :click-to-close="true">
    <CalendarEventEditModal :selectedDate="selectedDate" @save="handleEventSave" @edit="handleEventEdit" @delete="handleEventDelete" @close="showModal = false; selectedDate = null" />
  </VueFinalModal>
</template>

<style scoped>
.fc {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
