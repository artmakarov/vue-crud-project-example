import { ForbiddenPage, NotFoundPage } from '@/core';
import { i18n } from '@/plugins';
import { watch } from 'vue';
import {
  createRouter,
  createWebHistory,
  type RouteLocationAsRelativeGeneric,
  RouteRecordRaw,
} from 'vue-router';

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
    meta: { title: 'pages.notFound.title' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'Forbidden',
    component: ForbiddenPage,
    meta: { title: 'pages.forbidden.title' },
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

export function setDocumentTitle(title?: string): void {
  const { t, te } = i18n.global;
  const appTitle = t('layout.title');
  const pageTitle = title && te(title) ? t(title) : title;

  document.title = pageTitle ? `${pageTitle} — ${appTitle}` : appTitle;
}

router.onError((error) => console.error('[Router] Ошибка навигации:', error));
router.beforeEach((to) => setDocumentTitle(to.meta.title));

router.isReady().then(() => {
  const { locale } = i18n.global;

  watch(locale, () => setDocumentTitle(router.currentRoute.value.meta.title));
});
