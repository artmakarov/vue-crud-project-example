<template>
  <div>
    <v-row class="mb-4">
      <v-col cols="12" md="8">
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

      <v-col cols="12" md="4" class="d-flex justify-end">
        <v-btn color="primary" prepend-icon="mdi-plus" variant="outlined" @click="$emit('create')">
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
      <template #item.status="{ item }">
        <ApplicantStatusChip :status="item.status"/>
      </template>

      <template #item.createdAt="{ item }">
        {{ new Date(item.createdAt).toLocaleDateString('ru-RU') }}
      </template>

      <template #item.actions="{ item }">
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
import type { IApplicant } from '../types';
import { computed } from 'vue';
import { EmptyState } from '@/shared';
import ApplicantStatusChip from './ApplicantStatusChip.vue';

const props = defineProps<{
  items: IApplicant[];
  itemsLength: number;
  itemsPerPage?: number;
  page?: number;
  sortBy?: ISortOption<IApplicant>[];
  searchText?: string;
  loading?: boolean;
}>();

const emit = defineEmits<{
  create: []
  edit: [applicant: IApplicant]
  delete: [applicant: IApplicant]
  'update:searchText': [text: string]
  'update:options': [options: {
    page: number
    itemsPerPage: number
    sortBy: ISortOption<IApplicant>[]
  }]
}>();

const headers = [
  { title: 'ФИО', key: 'fullName' },
  { title: 'Телефон', key: 'phone' },
  { title: 'Статус', key: 'status', width: 140 },
  { title: 'Дата создания', key: 'createdAt', width: 160 },
  { title: 'Действия', key: 'actions', align: 'end' as const, width: 140, sortable: false },
];

const search = computed<string>({
  get: () => props.searchText || '',
  set: (value) => emit('update:searchText', value),
});
</script>
