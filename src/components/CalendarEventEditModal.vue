<script setup lang="ts">
import type { DateSelectArg, EventApi } from '@fullcalendar/core';
import { useForm, useField } from 'vee-validate';
import { onMounted, ref } from 'vue';
import { v4 as uuidv4 } from 'uuid';
// @ts-ignore verte-vue3 doesn't have types
import Verte from 'verte-vue3';
import * as yup from 'yup';

import { isEndAfterStartDate, isEndTimeAfterStartTime, isValidDate, timeFormat } from '@/validators';

const props = defineProps<{ selectedDate: DateSelectArg | EventApi | null }>();
const eventId = ref<string | null>(null);
const emit = defineEmits(['close', 'save', 'edit', 'delete']);

const { meta, setFieldValue, handleSubmit } = useForm({
  validationSchema: yup.object({
    title: yup.string().required().max(30).trim(),
    startDay: isValidDate(),
    endDay: isEndAfterStartDate().concat(isValidDate()),
    startTime: timeFormat(),
    endTime: isEndTimeAfterStartTime(),
    backgroundColor: yup.string().default('#3b82f6'),
  }),
});

const { value: title, errorMessage: titleError } = useField('title');
const { value: startDay, errorMessage: startDayError } = useField('startDay');
const { value: endDay, errorMessage: endDayError } = useField('endDay');
const { value: startTime, errorMessage: startTimeError } = useField('startTime');
const { value: endTime, errorMessage: endTimeError } = useField('endTime');
const { value: backgroundColor } = useField('backgroundColor');

const onSubmit = handleSubmit((values) => {
  const { title, startDay, startTime, endDay, endTime, backgroundColor } = values;
  const startDate = new Date(`${startDay}T${startTime}`);
  const endDate = new Date(`${endDay}T${endTime}`);

  const newEvent: Partial<EventApi> = {
    id: eventId.value ?? uuidv4(),
    title,
    start: startDate,
    end: endDate,
    backgroundColor,
  };
  
  emit(eventId.value ? 'edit' : 'save', newEvent);
});

onMounted(() => {
  if (props.selectedDate) {
    const { start, startStr, end, endStr, title, id, backgroundColor } = props.selectedDate as EventApi;
    eventId.value = id ?? null;

    const toDateStr = (date: string) => date.split('T')[0];
    const toTimeStr = (date: Date) => date.toTimeString().slice(0, 5);

    setFieldValue('startDay', toDateStr(startStr));
    setFieldValue('endDay', toDateStr(endStr));
    setFieldValue('backgroundColor', backgroundColor);

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

    <div class="flex justify-between mb-4">
      <span>Background color:</span>
      <Verte picker="square" model="hex" v-model="backgroundColor"></Verte>
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