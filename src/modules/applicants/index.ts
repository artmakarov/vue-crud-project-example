import { IModule } from '@/core';

// Публичный API модуля
export * from './api';
export * from './composables';
export * from './constants';
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
      title: 'Кандидаты',
      icon: 'mdi-account-group',
    },
  ],
  install: () => {
    // Опционально: регистрация плагинов, директив и т.д.
    console.log('[ApplicantsModule] install() вызван.');
  },
};

export default applicantsModule;
