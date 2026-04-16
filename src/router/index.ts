import {
  createRouter,
  createWebHistory,
  type RouteLocationAsRelativeGeneric,
  RouteRecordRaw,
} from 'vue-router';
import { ForbiddenPage, NotFoundPage } from '@/core';

export const router = createRouter({
  history: createWebHistory(),
  routes: [],
});

/** Страницы ошибок всегда должны быть последними */
const errorRoutes: RouteRecordRaw[] = [
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundPage,
    meta: { title: 'Страница не найдена' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Forbidden',
    component: ForbiddenPage,
    meta: { title: 'Страница не доступна' },
  },
];

export function registerRoutes(
  routes: RouteRecordRaw[],
  options: {
    defaultRoute?: string | RouteLocationAsRelativeGeneric;
  } = {},
): void {
  // Редирект на маршрут по умолчанию
  router.addRoute({
    path: '/',
    name: 'Home',
    redirect: options.defaultRoute ?? { name: 'Forbidden' },
  });

  routes.concat(errorRoutes).forEach((route) => router.addRoute(route));
}

router.beforeEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} — Справочники`
    : 'Справочники';
});

router.onError((error) => {
  console.error('[Router] Ошибка навигации:', error);
});
