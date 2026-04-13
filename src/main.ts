import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { App } from '@/core';
import { vuetify } from './plugins';
import { router } from './router';

async function enableMocking(): Promise<void> {
  if (import.meta.env.DEV) {
    const { worker } = await import('./mocks/browser');

    await worker.start({ onUnhandledRequest: 'bypass' });
  }
}

enableMocking().then(() => {
  const app = createApp(App);

  app.use(createPinia());
  app.use(router);
  app.use(vuetify);

  app.mount('#app');
});
