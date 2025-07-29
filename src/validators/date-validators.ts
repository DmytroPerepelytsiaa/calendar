import * as yup from 'yup';
import { timeRegex } from '../constants/regex.const';

export const isValidDate = () =>
  yup.string().required().test(
    'is-valid-date',
    'Invalid calendar date (YYYY-MM-DD)',
    function (value) {
      if (!value) return false;

      const date = new Date(value);

      return !isNaN(date.getTime()) && value === date.toISOString().split('T')[0];
    }
  );

export const isEndAfterStartDate = () =>
  yup.string().required().test(
    'is-after-or-equal',
    'End date must be equal to or after start date',
    function (value) {
      const { startDay } = this.parent;

      if (!startDay || !value) return true;
      
      return value >= startDay;
    }
  );

export const timeFormat = () =>
  yup.string().required().matches(timeRegex, 'Time must be in HH:MM format');

export const isEndTimeAfterStartTime = () =>
  yup.string().required().matches(timeRegex, 'Time must be in HH:MM format').test(
    'endTime-after-startTime',
    'End time must be after start time',
    function (value) {
      const { startDay, endDay, startTime } = this.parent;
      if (!startTime || !value || !startDay || !endDay || startDay !== endDay) return true;

      const [startH, startM] = startTime.split(':').map(Number);
      const [endH, endM] = value.split(':').map(Number);
      const startTotal = startH * 60 + startM;
      const endTotal = endH * 60 + endM;

      return endTotal >= startTotal;
    }
  );
