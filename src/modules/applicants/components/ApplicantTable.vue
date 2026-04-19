<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          :label="$t('applicants.table.labels.search')"
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>

      <v-col cols="12" md="4">
        <v-select
          v-model="statusFilter"
          :items="statusOptions"
          :label="$t('applicants.table.labels.statusFilter')"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          clearable
          hide-details
        />
      </v-col>

      <v-col cols="12" md="2" class="d-flex justify-end">
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          variant="outlined"
          @click="$emit('create')"
        >
          {{ $t('common.add') }}
        </v-btn>
      </v-col>
    </v-row>

    <v-data-table-server
      :headers="headers"
      :items="items"
      :loading="loading"
      :items-length="itemsLength"
      :items-per-page="itemsPerPage"
      :page="page"
      :sort-by="sortBy"
      @update:options="$emit('update:options', $event)"
    >
      <template #[`item.status`]="{ item }">
        <ApplicantStatusChip :status="item.status" />
      </template>

      <template #[`item.createdAt`]="{ item }">
        {{ formatDate(item.createdAt) }}
      </template>

      <template #[`item.actions`]="{ item }">
        <v-btn
          icon="mdi-pencil"
          size="small"
          variant="text"
          @click="$emit('edit', item)"
        />

        <v-btn
          icon="mdi-delete"
          size="small"
          variant="text"
          color="error"
          @click="$emit('delete', item)"
        />
      </template>

      <template #no-data>
        <empty-state
          :title="$t('applicants.table.emptyTitle')"
          :subtitle="$t('applicants.table.emptySubtitle')"
          :action-text="$t('common.add')"
          action-icon="mdi-plus"
          @action="$emit('create')"
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import type { ApplicantStatusType, IApplicant } from '../types';
import { EmptyState, formatDate, ISortOption } from '@/shared';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApplicantStatuses } from '../composables';
import ApplicantStatusChip from './ApplicantStatusChip.vue';

const props = defineProps<{
  items: IApplicant[];
  itemsLength: number;
  itemsPerPage?: number;
  page?: number;
  sortBy?: ISortOption<IApplicant>[];
  searchText?: string;
  statusFilter?: ApplicantStatusType | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  create: [];
  edit: [applicant: IApplicant];
  delete: [applicant: IApplicant];
  'update:searchText': [text: string];
  'update:statusFilter': [status: ApplicantStatusType | null];
  'update:options': [
    options: {
      page: number;
      itemsPerPage: number;
      sortBy: ISortOption<IApplicant>[];
    },
  ];
}>();

const { t } = useI18n();
const { statusOptions } = useApplicantStatuses();

const headers = computed(() => [
  { key: 'fullName', title: t('applicants.table.headers.fullName') },
  { key: 'phone', title: t('applicants.table.headers.phone') },
  { key: 'status', title: t('applicants.table.headers.status'), width: 140 },
  {
    key: 'createdAt',
    title: t('applicants.table.headers.createdAt'),
    width: 160,
  },
  {
    key: 'actions',
    title: t('common.actions'),
    align: 'end' as const,
    width: 140,
    sortable: false,
  },
]);

const search = computed<string>({
  get: () => props.searchText || '',
  set: (value) => emit('update:searchText', value),
});

const statusFilter = computed<ApplicantStatusType | null>({
  get: () => props.statusFilter || null,
  set: (value) => emit('update:statusFilter', value),
});
</script>
