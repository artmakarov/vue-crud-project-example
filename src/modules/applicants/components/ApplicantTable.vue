<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field
          v-model="search"
          label="Поиск по ФИО"
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
          :items="STATUS_OPTIONS"
          label="Фильтр по статусу"
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
          Добавить
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
        {{ new Date(item.createdAt).toLocaleDateString('ru-RU') }}
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
          title="Список кандидатов пуст"
          subtitle="Добавьте первую запись"
          action-text="Добавить"
          action-icon="mdi-plus"
          @action="$emit('create')"
        />
      </template>
    </v-data-table-server>
  </div>
</template>

<script setup lang="ts">
import type { ISortOption } from '@/shared';
import type { ApplicantStatusType, IApplicant } from '../types';
import { computed } from 'vue';
import { EmptyState } from '@/shared';
import { STATUS_OPTIONS } from '../constants';
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

const headers = [
  { title: 'ФИО', key: 'fullName' },
  { title: 'Телефон', key: 'phone' },
  { title: 'Статус', key: 'status', width: 140 },
  { title: 'Дата создания', key: 'createdAt', width: 160 },
  {
    title: 'Действия',
    key: 'actions',
    align: 'end' as const,
    width: 140,
    sortable: false,
  },
];

const search = computed<string>({
  get: () => props.searchText || '',
  set: (value) => emit('update:searchText', value),
});

const statusFilter = computed<ApplicantStatusType | null>({
  get: () => props.statusFilter || null,
  set: (value) => emit('update:statusFilter', value),
});
</script>
