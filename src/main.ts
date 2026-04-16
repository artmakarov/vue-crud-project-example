import { App, useModulesStore } from '@/core';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import { vuetify } from './plugins';
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
  const pinia = createPinia();

  app.use(pinia);

  const modulesStore = useModulesStore();

  await modulesStore.initModules(app);

  registerRoutes(modulesStore.allRoutes, {
    defaultRoute: modulesStore.defaultRoute,
  });

  app.use(router);
  app.use(vuetify);

  app.mount('#app');
}

bootstrap().catch(console.error);
