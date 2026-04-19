import { App, useModulesStore } from '@/core';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { i18nCustomPlugin, vuetifyCustomPlugin } from './plugins';
import { registerRoutes, router } from './router';

async function enableMocking(): Promise<void> {
  const { worker } = await import('./mocks/browser');
  await worker.start({ onUnhandledRequest: 'bypass' });
}

async function bootstrap(): Promise<void> {
  if (import.meta.env.DEV) {
    await enableMocking();
  }

  const app = createApp(App);

  app.use(createPinia());
  app.use(i18nCustomPlugin);
  app.use(vuetifyCustomPlugin);

  const modulesStore = useModulesStore();

  await modulesStore.initModules(app);

  registerRoutes(modulesStore.allRoutes, {
    defaultRoute: modulesStore.defaultRoute,
  });

  // После регистрации маршрутов модулей
  app.use(router);

  app.mount('#app');
}

bootstrap().catch(console.error);
