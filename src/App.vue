<script setup lang="ts">
import FullCalendar from '@fullcalendar/vue3';
import { CALENDAR_OPTIONS } from './constants';

const calendarOptions = CALENDAR_OPTIONS;
</script>

<template>
  <FullCalendar :options="calendarOptions"></FullCalendar>
</template>

<style scoped></style>
