import { createRouter, createWebHistory } from 'vue-router';
import { NotFoundPage } from '@/core';
import { routes as applicantsRoutes } from '@/modules/applicants';

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'Home', redirect: { name: applicantsRoutes[0].name } },
    ...applicantsRoutes,
    // 404 — несуществующие маршруты
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: NotFoundPage,
      meta: { title: 'Страница не найдена' },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.title) {
    document.title = `${to.meta.title} — Справочники`;
  }
});

router.onError((error) => {
  console.error('[Router] Ошибка навигации:', error);
});
