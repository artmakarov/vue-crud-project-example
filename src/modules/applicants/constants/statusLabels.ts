import type { ApplicantStatusType } from '../types';

export const STATUS_OPTIONS: { value: ApplicantStatusType; title: string; }[] = [
  { value: 'new', title: 'Новый' },
  { value: 'in_work', title: 'В работе' },
  { value: 'done', title: 'Завершён' },
];
