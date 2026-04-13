import type { IApplicant } from '../../types';
import { apiClient } from '@/shared';

/**
 * Удалить кандидата
 */
export async function deleteApplicant(
  id: IApplicant['id'],
): Promise<void> {
  return apiClient.delete<void>(`/applicants/${id}`);
}
