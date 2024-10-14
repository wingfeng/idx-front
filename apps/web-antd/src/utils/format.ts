import { i18n } from '@vben/locales';

import { useDateFormat } from '@vueuse/core';

const { locale } = i18n.global;
export function formatDate(date: Date) {
  return useDateFormat(date, 'YYYY-MM-DD dddd', { locales: locale.value });
}
