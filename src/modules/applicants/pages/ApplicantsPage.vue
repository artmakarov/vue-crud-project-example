<template>
  <ApplicantTable
      v-model:search-text="searchInput"
      :items="list"
      :items-length="total"
      :loading="isLoading"
      :items-per-page="pagination.itemsPerPage"
      :page="pagination.page"
      :sort-by="sortBy"
      @create="onCreate"
      @edit="onEdit"
      @delete="onDelete"
      @update:options="onOptionsChange"
  />

  <ApplicantFormDialog
      v-model="showFormDialog"
      :applicant="selectedApplicant"
      @save="onSave"
  />

  <ConfirmDialog
      v-model="showDeleteDialog"
      title="Удаление кандидата"
      :message="`Вы уверены, что хотите удалить «${selectedApplicant?.fullName}»?`"
      confirm-text="Удалить"
      @confirm="onDeleteConfirm"
  />
</template>

<script setup lang="ts">
import type { ApplicantFormDataType, IApplicant } from '../types';
import type { ISortOption } from '@/shared';
import { ConfirmDialog, useDebounce } from '@/shared';
import { ref, watch } from 'vue';
import { ApplicantFormDialog, ApplicantTable } from '../components';
import { useApplicants, useRealtimeMock } from '../composables';

// Real-time только в dev
if (import.meta.env.DEV) {
  useRealtimeMock();
}

const {
  list,
  total,
  isLoading,
  pagination,
  sortBy,
  handleCreate,
  handleDelete,
  handleUpdate,
  handleSearch,
  handleSortChange,
  handleItemsPerPageChange,
  handlePageChange,
} = useApplicants();

const { value: searchInput, debouncedValue: searchQuery } = useDebounce<string>('', 300);

const showFormDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedApplicant = ref<IApplicant | null>(null);

function onOptionsChange(options: {
  page: number
  itemsPerPage: number
  sortBy: ISortOption<IApplicant>[]
}): void {
  handleSortChange(options.sortBy);
  handleItemsPerPageChange(options.itemsPerPage);
  handlePageChange(options.page);
}

function onCreate(): void {
  selectedApplicant.value = null;
  showFormDialog.value = true;
}

function onEdit(applicant: IApplicant): void {
  selectedApplicant.value = applicant;
  showFormDialog.value = true;
}

async function onSave(data: ApplicantFormDataType): Promise<void> {
  if (selectedApplicant.value) {
    await handleUpdate(selectedApplicant.value.id, data);
    selectedApplicant.value = null;
  } else {
    await handleCreate(data);
  }

  showFormDialog.value = false;
}

function onDelete(applicant: IApplicant): void {
  selectedApplicant.value = applicant;
  showDeleteDialog.value = true;
}

async function onDeleteConfirm(): Promise<void> {
  if (selectedApplicant.value) {
    await handleDelete(selectedApplicant.value.id);
  }

  showDeleteDialog.value = false;
}

watch(searchQuery, (newQuery) => {
  handleSearch(newQuery);
});
</script>
