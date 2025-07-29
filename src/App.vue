<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import { DateSelectArg } from '@fullcalendar/core';
import { VueFinalModal } from 'vue-final-modal';
import { ref } from 'vue';
import 'vue-final-modal/style.css'; // стили

import { CALENDAR_OPTIONS } from './constants';
import EventEditModal from './components/EventEditModal.vue';
import './assets/main.scss';

const showModal = ref(false);
const selectedDate = ref<DateSelectArg>(null);

const handleDateSelect = (selectInfo: DateSelectArg): void => {
  selectedDate.value = selectInfo;
  showModal.value = true;
};

const calendarOptions = { ...CALENDAR_OPTIONS, select: handleDateSelect };
</script>

<template>
  <FullCalendar :options="calendarOptions"></FullCalendar>

  <VueFinalModal v-model="showModal" :esc-to-close="true" :click-to-close="true">
    <EventEditModal :selectedDate="selectedDate" @close="showModal = false" />
  </VueFinalModal>
</template>

<style scoped>
.fc {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
