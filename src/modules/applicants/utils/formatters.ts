import type { ApplicantStatusType } from '../types';

const statusColors: Record<ApplicantStatusType, string> = {
  new: 'info',
  in_work: 'warning',
  done: 'success',
};

const statusLabels: Record<ApplicantStatusType, string> = {
  new: 'Новый',
  in_work: 'В работе',
  done: 'Завершён',
};

export function getStatusColor(status: ApplicantStatusType): string {
  return statusColors[status] || 'grey';
}

export function getStatusLabel(status: ApplicantStatusType): string {
  return statusLabels[status] || status;
}
