<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import { DateSelectArg, EventInput } from '@fullcalendar/core';
import { VueFinalModal } from 'vue-final-modal';
import { ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import 'vue-final-modal/style.css'; // стили

import { CALENDAR_OPTIONS } from './constants';
import { useCalendarEventStorage } from './composables';
import { CalendarEventSavePayload } from './models';
import CalendarEventEditModal from './components/CalendarEventEditModal.vue';
import './assets/main.scss';

const showModal = ref(false);
const selectedDate = ref<DateSelectArg>(null);
const calendarApi = ref(null);
const { getEvents, addEvent } = useCalendarEventStorage();

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  selectedDate.value = selectInfo;
  calendarApi.value = selectInfo.view.calendar;
  calendarApi.value.unselect();
  showModal.value = true;
};

const calendarOptions = { ...CALENDAR_OPTIONS, initialEvents: getEvents(), select: handleDateSelect };

const handleEventSave = (eventData: CalendarEventSavePayload): void => {
  const { title, startDay, startTime, endDay, endTime } = eventData;
  const startDate = new Date(`${startDay}T${startTime}`);
  const endDate = new Date(`${endDay}T${endTime}`);

  const newEvent: EventInput = {
    id: uuidv4(),
    title,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };

  addEvent(newEvent);
  calendarApi.addEvent(newEvent);
  showModal.value = false;
};
</script>

<template>
  <FullCalendar :options="calendarOptions"></FullCalendar>

  <VueFinalModal v-model="showModal" :esc-to-close="true" :click-to-close="true">
    <CalendarEventEditModal :selectedDate="selectedDate" @save="handleEventSave" @close="showModal = false" />
  </VueFinalModal>
</template>

<style scoped>
.fc {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
