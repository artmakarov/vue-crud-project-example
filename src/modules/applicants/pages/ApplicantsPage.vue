<template>
  <ApplicantTable
    v-model:search-text="searchInput"
    v-model:status-filter="filters.status"
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
    @update:status-filter="handleStatusFilterChange"
  />

  <ApplicantFormDialog
    v-model="showFormDialog"
    :applicant="selectedApplicant"
    @save="onSave"
  />

  <ConfirmDialog
    v-model="showDeleteDialog"
    :title="$t('applicants.dialogs.deleteApplicant.title')"
    :message="
      $t('applicants.dialogs.deleteApplicant.message', {
        name: selectedApplicant?.fullName ?? '',
      })
    "
    :confirm-text="$t('common.delete')"
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
  filters,
  handleCreate,
  handleDelete,
  handleUpdate,
  handleSearch,
  handleSortChange,
  handleItemsPerPageChange,
  handlePageChange,
  handleStatusFilterChange,
} = useApplicants();

const { value: searchInput, debouncedValue: debouncedSearchQuery } =
  useDebounce<string>('', 300);

const showFormDialog = ref(false);
const showDeleteDialog = ref(false);
const selectedApplicant = ref<IApplicant | null>(null);

function onOptionsChange(options: {
  page: number;
  itemsPerPage: number;
  sortBy: ISortOption<IApplicant>[];
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

watch(debouncedSearchQuery, (newQuery) => handleSearch(newQuery));
</script>
