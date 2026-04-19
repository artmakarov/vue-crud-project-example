import type { RouteRecordRaw } from 'vue-router';

export const routes: RouteRecordRaw[] = [
  {
    path: '/applicants',
    name: 'Applicants',
    component: () => import('../pages/ApplicantsPage.vue'),
    meta: { title: 'applicants.pageTitle' },
  },
];
