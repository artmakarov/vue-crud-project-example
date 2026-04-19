import { i18n, SupportedLocale } from '@/plugins';
import { MaybeRefOrGetter, toValue } from 'vue';

export function formatDate(
  date: string | Date,
  locale?: MaybeRefOrGetter<string | SupportedLocale>,
): string {
  const dateObject = typeof date === 'string' ? new Date(date) : date;
  const resolvedLocale = locale ? toValue(locale) : i18n.global.locale.value;

  return dateObject.toLocaleDateString(resolvedLocale);
}
