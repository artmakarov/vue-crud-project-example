import type { ApplicantFormDataType, IApplicant } from '../types';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  createApplicant,
  deleteApplicant,
  getApplicants,
  type IApplicantsSearchCriteria,
  updateApplicant,
} from '../api';

export type StoreStatusType = 'idle' | 'loading' | 'success' | 'error';

/**
 * Хранилище данных кандидатов (только данные + CRUD-операции)
 */
export const useApplicantsStore = defineStore('applicants', () => {
  const entities = ref<Record<IApplicant['id'], IApplicant>>({});
  const ids = ref<IApplicant['id'][]>([]);
  const total = ref<number>(0);
  const status = ref<StoreStatusType>('idle');
  const error = ref<string | null>(null);

  const list = computed<IApplicant[]>(() =>
    ids.value.map((id) => entities.value[id]),
  );

  const isLoading = computed<boolean>(() => status.value === 'loading');
  const hasError = computed<boolean>(() => status.value === 'error');
  const getById = computed<(id: number) => IApplicant | undefined>(
    () => (id: number) => entities.value[id],
  );

  /**
   * Загрузить список с параметрами
   */
  async function fetchList(criteria: IApplicantsSearchCriteria): Promise<void> {
    status.value = 'loading';
    error.value = null;

    try {
      const response = await getApplicants(criteria);

      entities.value = {};
      ids.value = [];

      response.data.forEach((applicant) => {
        entities.value[applicant.id] = applicant;
        ids.value.push(applicant.id);
      });

      total.value = response.total;
      status.value = 'success';
    } catch (e) {
      status.value = 'error';
      error.value =
        e instanceof Error ? e.message : 'Ошибка загрузки кандидатов';

      throw e;
    }
  }

  /**
   * Создать кандидата
   */
  async function create(data: ApplicantFormDataType): Promise<IApplicant> {
    status.value = 'loading';
    error.value = null;

    try {
      const created = await createApplicant(data);

      status.value = 'success';

      return created;
    } catch (e) {
      status.value = 'error';
      error.value =
        e instanceof Error ? e.message : 'Ошибка создания кандидата';

      throw e;
    }
  }

  /**
   * Обновить кандидата
   */
  async function update(
    id: IApplicant['id'],
    data: Partial<ApplicantFormDataType>,
  ): Promise<IApplicant> {
    status.value = 'loading';
    error.value = null;

    try {
      const updated: IApplicant = await updateApplicant(id, data);

      entities.value[id] = { ...entities.value[id], ...updated };
      status.value = 'success';

      return updated;
    } catch (e) {
      status.value = 'error';
      error.value =
        e instanceof Error ? e.message : 'Ошибка обновления кандидата';

      throw e;
    }
  }

  /**
   * Удалить кандидата
   */
  async function remove(id: IApplicant['id']): Promise<void> {
    status.value = 'loading';
    error.value = null;

    try {
      await deleteApplicant(id);

      status.value = 'success';
    } catch (e) {
      status.value = 'error';
      error.value =
        e instanceof Error ? e.message : 'Ошибка удаления кандидата';

      throw e;
    }
  }

  /** Для имитации "live update" — заменяет весь объект для триггера реактивности */
  function updateApplicantInPlace(
    id: IApplicant['id'],
    data: Partial<Omit<IApplicant, 'id' | 'createdAt'>>,
  ): void {
    const existing = entities.value[id];

    if (!existing) return;

    entities.value[id] = { ...existing, ...data };
  }

  function resetData(): void {
    entities.value = {};
    ids.value = [];
    total.value = 0;
    status.value = 'idle';
    error.value = null;
  }

  return {
    entities,
    ids,
    total,
    status,
    error,
    list,
    isLoading,
    hasError,
    getById,
    fetchList,
    create,
    update,
    remove,
    updateApplicantInPlace,
    resetData,
  };
});
