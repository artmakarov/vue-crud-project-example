import type { ApplicantFormDataType, IApplicant } from '../../types';
import { apiClient } from '@/shared';

/**
 * Создать нового кандидата
 */
export async function createApplicant(
  data: ApplicantFormDataType,
): Promise<IApplicant> {
  return apiClient.post<IApplicant>('/applicants', data);
}
