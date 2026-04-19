<template>
  <v-chip :color="resolvedColor" :size="size">
    {{ resolvedStatus }}
  </v-chip>
</template>

<script setup lang="ts">
import type { ApplicantStatusType } from '../types';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { getStatusColor } from '../utils';

const props = withDefaults(
  defineProps<{
    status: ApplicantStatusType;
    size?: 'small' | 'default' | 'large';
  }>(),
  {
    size: 'small',
  },
);

const { t } = useI18n();

const resolvedColor = computed(() => getStatusColor(props.status));
const resolvedStatus = computed(() => t(`applicants.statuses.${props.status}`));
</script>
