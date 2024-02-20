import dayjs from 'dayjs';

export const DATE_FORMAT = "yyyy/MM/DD";

export const LS_KEY = "peritoneal-dialysis-day-record_";

export const convertNumber = (value) => {
  return (isNaN(value))? 0: Number(value);
}

export const calcDiffMinutes = (from ,to) => {
  let _from = dayjs(from).format('YYYY-MM-DD HH:mm:00');
  let _to = dayjs(to).format('YYYY-MM-DD HH:mm:00');
  return dayjs(_from).diff(dayjs(_to), 'minute');
}