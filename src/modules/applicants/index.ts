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
  install: (app) => {
    app.$addModuleLocaleMessages({ ru, en });
  },
};

export default applicantsModule;
