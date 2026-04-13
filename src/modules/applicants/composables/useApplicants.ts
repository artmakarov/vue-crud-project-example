import type { ISortOption } from '@/shared';
import type { IApplicantsSearchCriteria } from '../api';
import type {
  ApplicantFormDataType,
  IApplicant,
  IFilters,
  IPaginationParams,
} from '../types';
import { useSnackbarStore } from '@/core';
import { onMounted, readonly, ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useApplicantsStore } from '../stores';

export function useApplicants() {
  const snackbar = useSnackbarStore();
  const store = useApplicantsStore();
  const { list, total, isLoading, hasError, error } = storeToRefs(store);

  const pagination = ref<IPaginationParams>({ page: 1, itemsPerPage: 10 });
  const search = ref<string>('');
  const filters = ref<IFilters>({ status: null });
  const sortBy = ref<ISortOption<IApplicant>[]>([
    {
      key: 'createdAt',
      order: 'desc',
    },
  ]);

  function getSearchCriteria(): IApplicantsSearchCriteria {
    return {
      page: pagination.value.page,
      limit: pagination.value.itemsPerPage,
      search: search.value || undefined,
      status: filters.value.status || undefined,
      sortBy: sortBy.value[0]?.key,
      sortOrder: sortBy.value[0]?.order,
    };
  }

  async function fetchList(): Promise<void> {
    const searchCriteria = getSearchCriteria();

    try {
      await store.fetchList(searchCriteria);
    } catch (e) {
      e instanceof Error && snackbar.showMessage(e.message, 'error');
    }
  }

  async function handleCreate(
    data: ApplicantFormDataType,
  ): Promise<IApplicant> {
    try {
      const created = await store.create(data);
      snackbar.showMessage('Кандидат успешно создан', 'success');
      await fetchList();
      return created;
    } catch (e) {
      e instanceof Error && snackbar.showMessage(e.message, 'error');
      throw e;
    }
  }

  async function handleUpdate(
    id: IApplicant['id'],
    data: ApplicantFormDataType,
  ): Promise<IApplicant> {
    try {
      const updated = await store.update(id, data);
      snackbar.showMessage('Кандидат успешно обновлен', 'success');
      return updated;
    } catch (e) {
      e instanceof Error && snackbar.showMessage(e.message, 'error');
      throw e;
    }
  }

  async function handleDelete(id: IApplicant['id']): Promise<void> {
    try {
      await store.remove(id);
      snackbar.showMessage('Кандидат успешно удален', 'success');
      await fetchList();
    } catch (e) {
      e instanceof Error && snackbar.showMessage(e.message, 'error');
      throw e;
    }
  }

  function handleSearch(query: string): void {
    search.value = query;
    pagination.value.page = 1;
  }

  function handleSortChange(sort: ISortOption<IApplicant>[]): void {
    sortBy.value = sort;
    pagination.value.page = 1;
  }

  function handleItemsPerPageChange(itemsPerPage: number): void {
    pagination.value.itemsPerPage = itemsPerPage;
    pagination.value.page = 1;
  }

  function handlePageChange(page: number): void {
    pagination.value.page = page;
  }

  function resetFilters(): void {
    search.value = '';
    filters.value = { status: null };
    sortBy.value = [{ key: 'createdAt', order: 'desc' }];
    pagination.value.page = 1;
  }

  // Автоматическая перезагрузка при изменении параметров
  watch([pagination, search, filters, sortBy], () => fetchList(), {
    deep: true,
  });

  onMounted(() => fetchList());

  return {
    // Данные
    list,
    isLoading,
    hasError,
    error: readonly(error),
    total: readonly(total),

    // Параметры запроса
    pagination,
    search,
    filters,
    sortBy,

    // Методы
    fetchList,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSearch,
    handleSortChange,
    handleItemsPerPageChange,
    handlePageChange,
    resetFilters,
  };
}
