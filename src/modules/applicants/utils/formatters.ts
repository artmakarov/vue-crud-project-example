import type { ApplicantStatusType } from '../types';

const statusColors: Record<ApplicantStatusType, string> = {
  new: 'info',
  in_work: 'warning',
  done: 'success',
};

export function getStatusColor(status: ApplicantStatusType): string {
  return statusColors[status] || 'grey';
}
