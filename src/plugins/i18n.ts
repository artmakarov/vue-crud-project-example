import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';
import en from '@/locales/en.json';
import ru from '@/locales/ru.json';

export type SupportedLocale = 'ru' | 'en';

const STORAGE_KEY = 'app_locale';

export const supportedLocales: SupportedLocale[] = ['ru', 'en'];

export function isSupportedLocale(
  value?: string | null,
): value is SupportedLocale {
  return supportedLocales.includes(value as SupportedLocale);
}

function detectLocale(): SupportedLocale {
  const storedLocale = localStorage.getItem(STORAGE_KEY);

  if (isSupportedLocale(storedLocale)) {
    return storedLocale;
  }

  const browserLocale = navigator.language.toLowerCase();

  if (browserLocale.startsWith('ru')) {
    return 'ru';
  }

  return 'en';
}

export const i18n = createI18n({
  legacy: false,
  locale: detectLocale(),
  fallbackLocale: 'en',
  messages: {
    ru,
    en,
  },
});

export function setLocale(locale: SupportedLocale): void {
  i18n.global.locale.value = locale;
  localStorage.setItem(STORAGE_KEY, locale);
}

function addModuleLocaleMessages(
  messages: Record<SupportedLocale, Record<string, unknown>>,
): void {
  for (const locale of supportedLocales) {
    i18n.global.mergeLocaleMessage(locale, messages[locale]);
  }
}

export const i18nCustomPlugin: Plugin = (app) => {
  app.use(i18n);
  app.$addModuleLocaleMessages = addModuleLocaleMessages;
};

declare module 'vue' {
  interface App {
    $addModuleLocaleMessages: typeof addModuleLocaleMessages;
  }
}
