<script setup lang="ts">
import type { DateSelectArg, EventApi } from '@fullcalendar/core';
import { useForm, useField } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import * as yup from 'yup';

const props = defineProps<{ selectedDate: DateSelectArg | EventApi | null }>();
const eventId = ref<string | null>(null);
const emit = defineEmits(['close', 'save', 'edit', 'delete']);
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;

const { meta, setFieldValue, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required().max(30),
    startDay: yup.string().required().test(
      'is-valid-date',
      'Invalid calendar date (YYYY-MM-DD)', 
      function (value) {
        if (!value) return false;

        const date = new Date(value);
        
        return !isNaN(date.getTime()) && value === date.toISOString().split('T')[0];
      }
    ),
    endDay: yup.string().required().test(
      'is-after-or-equal',
      'End date must be equal to or after start date',
      function (value) {
        const { startDay } = this.parent;

        if (!startDay || !value) return true;

        return value >= startDay;
      }
    ).test(
      'is-valid-date',
      'Invalid calendar date (YYYY-MM-DD)', 
      function (value) {
        if (!value) return false;

        const date = new Date(value);
        
        return !isNaN(date.getTime()) && value === date.toISOString().split('T')[0];
      }
    ),
    startTime: yup.string().required().matches(timeRegex, 'Time must be in HH:MM format'),
    endTime: yup.string().required().matches(timeRegex, 'Time must be in HH:MM format').test(
      'endTime-after-startTime', 
      'End time must be after start time', 
      function (value) {
        const { startDay, endDay, startTime } = this.parent;

        if ((!startTime || !value || !startDay || !endDay) || (startDay !== endDay)) {
          return true;
        }

        const [startH, startM] = startTime.split(':').map(Number);
        const [endH, endM] = value.split(':').map(Number);
        const startTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        return endTotal >= startTotal;
      }
    ),
  }),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: startDay, errorMessage: startDayError } = useField('startDay');
const { value: endDay, errorMessage: endDayError } = useField('endDay');
const { value: startTime, errorMessage: startTimeError } = useField('startTime');
const { value: endTime, errorMessage: endTimeError } = useField('endTime');

const onSubmit = handleSubmit((values) => {
  const { title, startDay, startTime, endDay, endTime } = values;
  const startDate = new Date(`${startDay}T${startTime}`);
  const endDate = new Date(`${endDay}T${endTime}`);

  const newEvent: Partial<EventApi> = {
    id: eventId.value ?? uuidv4(),
    title,
    start: startDate,
    end: endDate,
  };
  
  emit(eventId.value ? 'edit' : 'save', newEvent);
});

onMounted(() => {
  if (props.selectedDate) {
    const { start, startStr, end, endStr, title, id } = props.selectedDate as EventApi;
    eventId.value = id ?? null;

    const toDateStr = (date: string) => date.split('T')[0];
    const toTimeStr = (date: Date) => date.toTimeString().slice(0, 5);

    setFieldValue('startDay', toDateStr(startStr));
    setFieldValue('endDay', toDateStr(endStr));

    if (start) {
      setFieldValue('startTime', toTimeStr(start));
    }

    if (end) {
      setFieldValue('endTime', toTimeStr(end));
    }

    if (title) {
      setFieldValue('title', title);
    }
  }
});
</script>

<template>
  <form @submit.prevent class="border border-slate-300 p-5 rounded-lg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] bg-slate-100">
    <button class="border border-slate-300 flex items-center justify-center text-xs h-5 w-5 rounded-full absolute top-2 right-2" @click="emit('close')">X</button>

    <label class="mt-4 mb-4 block">
      <input class="form-input" placeholder="Event title" v-model="title" />
      <span class="text-red-500 text-sm">{{ titleError }}</span>
    </label>
    
    <div class="mb-4">
      <div class="flex gap-2 items-center">
        <label class="block">
          <input class="form-input" placeholder="Start day" v-model="startDay" />
        </label>
  
        <label class="block">
          <input class="form-input" placeholder="End day" v-model="endDay" />
        </label>
      </div>

      <span class="text-red-500 text-sm">{{ startDayError ?? endDayError }}</span>
    </div>

    <div class="mb-4">
      <div class="flex gap-2 items-center">
        <label class="block">
          <input class="form-input" placeholder="Start time" v-model="startTime" />
        </label>
  
        <label class="block">
          <input class="form-input" placeholder="End time" v-model="endTime" />
        </label>
      </div>

      <span class="text-red-500 text-sm">{{ startTimeError ?? endTimeError }}</span>
    </div>

    <div class="flex justify-between items-center">
      <button class="border border-red-400 text-red-400 rounded-lg px-3 py-1.5 hover:bg-red-400 hover:text-white transition-colors" @click="eventId ? emit('delete') : emit('close')">{{ eventId ? 'Discard' : 'Cancel' }}</button>
      <button :disabled="!meta.valid" class="border bg-blue-500 rounded-lg text-white px-3 py-1.5 disabled:bg-slate-700 disabled:hover:bg-slate-600 transition-colors" @click="onSubmit">{{ eventId ? 'Edit' : 'Save' }}</button>
    </div>
  </form>
</template>

<style scoped>
.form-input {
  @apply border border-slate-300 rounded-sm px-3 py-1.5 w-full outline-slate-300;
}
</style>