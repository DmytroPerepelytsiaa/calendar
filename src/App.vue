<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import type { CalendarApi, DateSelectArg, EventApi, EventClickArg, EventInput } from '@fullcalendar/core';
import { VueFinalModal } from 'vue-final-modal';
import { ref } from 'vue';
import { onMounted } from 'vue';
import 'vue-final-modal/style.css';

import { CALENDAR_OPTIONS } from './constants';
import { useCalendarEventStorage } from './composables';
import type { CalendarEventSavePayload } from './models';
import CalendarEventEditModal from './components/CalendarEventEditModal.vue';
import './assets/main.scss';

let calendarApi: CalendarApi | null = null;
const showModal = ref(false);
const selectedDate = ref<DateSelectArg | EventApi | null>(null);
const calendarRef = ref<typeof FullCalendar | null>(null);
const { getEvents, addEvent, deleteEvent, updateEvent } = useCalendarEventStorage();

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

  addEvent(event);
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

  updateEvent(event as CalendarEventSavePayload);
  showModal.value = false;
  selectedDate.value = null;
};

const handleEventDelete = (): void => {
  const event = selectedDate.value as EventApi;
  event?.remove();
  deleteEvent(event.id);
  selectedDate.value = null;
  showModal.value = false;
};

const handleEventClick = (clickInfo: EventClickArg): void => {
  const event = clickInfo.event;
  selectedDate.value = event;
  showModal.value = true;
};

const calendarOptions = { ...CALENDAR_OPTIONS, initialEvents: getEvents(), select: handleDateSelect, eventClick: handleEventClick };

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
