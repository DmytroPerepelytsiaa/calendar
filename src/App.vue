<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import { CALENDAR_OPTIONS } from './constants';
import './assets/main.scss';

const calendarOptions = CALENDAR_OPTIONS;
</script>

<template>
  <FullCalendar :options="calendarOptions"></FullCalendar>
</template>

<style scoped>
.fc {
  max-width: 1100px;
  margin: 0 auto;
}
</style>
