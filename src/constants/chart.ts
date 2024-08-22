import { format, subDays } from 'date-fns';

export const getMinTicks = (dataset: any) => {
  const arr = [...dataset.datasets[0].data];
  let result = Math.min(...arr) - Math.floor((Math.min(...arr) + (Math.max(...arr) + 10)) / 10)
  if (result < 0) {
    result = 0;
  }

  return result;
}

export const getMaxTicks = (dataset: any) => {
  const arr = [...dataset.datasets[0].data];
  const result = Math.max(...arr) + Math.floor((Math.min(...arr) + (Math.max(...arr) + 10)) / 10)

  return result;
}

export const getStepSize = (dataset: any) => {
  const arr = [...dataset.datasets[0].data];
  const result = Math.floor((Math.min(...arr) + (Math.max(...arr) + 10)) / 10);

  return result;
}

/** 최근 (num)일의 날짜를 생성합니다. */
export const generateLastDays = (num: number, chartType: boolean) => {
  const dates = [];
  for (let i = num - 1; i >= (chartType ? -1 : 0); i--) {
    dates.push(format(subDays(new Date(), i), 'yyyy-MM-dd'));
  }
  return dates;
};