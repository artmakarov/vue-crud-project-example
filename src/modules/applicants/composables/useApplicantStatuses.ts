import type { ApplicantStatusType } from '@/modules/applicants';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export type ApplicantStatusOptionType = {
  value: ApplicantStatusType;
  title: string;
};

export function useApplicantStatuses() {
  const { t } = useI18n();

  const statusOptions = computed<ApplicantStatusOptionType[]>(() => [
    { value: 'new', title: t('applicants.statuses.new') },
    { value: 'in_work', title: t('applicants.statuses.in_work') },
    { value: 'done', title: t('applicants.statuses.done') },
  ]);

  return {
    statusOptions,
  };
}
