<template>
  <v-chip :color="getStatusColor(status)" :size="size">
    {{ getStatusLabel(status) }}
  </v-chip>
</template>

<script setup lang="ts">
import type { ApplicantStatusType } from '../types';
import { getStatusColor, getStatusLabel } from '../utils';

withDefaults(
  defineProps<{
    status: ApplicantStatusType;
    size?: 'small' | 'default' | 'large';
  }>(),
  {
    size: 'small',
  },
);
</script>
