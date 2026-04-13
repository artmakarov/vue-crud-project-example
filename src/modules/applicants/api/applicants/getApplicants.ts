import type { IApplicant } from '../../types';
import type { IPaginatedResponse } from '@/shared';
import { apiClient } from '@/shared';

export interface IApplicantsSearchCriteria {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Получить список кандидатов с пагинацией, поиском и сортировкой
 */
export async function getApplicants(
  searchCriteria: IApplicantsSearchCriteria,
): Promise<IPaginatedResponse<IApplicant>> {
  const { page, limit, search, status, sortBy, sortOrder } = searchCriteria;
  const params: Record<string, string> = {
    page: String(page),
    limit: String(limit),
  };

  if (search) params.search = search;
  if (status) params.status = status;
  if (sortBy) params.sortBy = sortBy;
  if (sortOrder) params.sortOrder = sortOrder;

  return apiClient.get<IPaginatedResponse<IApplicant>>('/applicants', params);
}
