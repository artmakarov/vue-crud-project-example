import { IModule } from '@/core';
import en from './locales/en.json';
import ru from './locales/ru.json';

// Публичный API модуля
export * from './api';
export * from './composables';
export * from './stores';
export * from './types';
export * from './utils';

const applicantsModule: IModule = {
  id: 'applicants',
  locales: { ru, en },
  getRoutes: async () => {
    // Динамический импорт — ленивая загрузка
    const { routes } = await import('./routes');
    return routes;
  },
  getNavItems: () => [
    {
      route: { name: 'Applicants' },
      title: 'applicants.navTitle',
      icon: 'mdi-account-group',
    },
  ],
  install: async () => {
    // Опционально: регистрация плагинов, директив и т.д.
  },
};

export default applicantsModule;
