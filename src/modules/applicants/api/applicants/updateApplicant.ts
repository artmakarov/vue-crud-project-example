import type { ApplicantFormDataType, IApplicant } from '../../types';
import { apiClient } from '@/shared';

/**
 * Обновить данные кандидата
 */
export async function updateApplicant(
  id: IApplicant['id'],
  data: Partial<ApplicantFormDataType>,
): Promise<IApplicant> {
  return apiClient.put<IApplicant>(`/applicants/${id}`, data);
}
