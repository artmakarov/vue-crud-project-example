<template>
  <v-dialog v-model="show" max-width="400" persistent>
    <v-card>
      <v-card-title>
        {{ resolvedTitle }}
      </v-card-title>

      <v-card-text>
        {{ message }}
      </v-card-text>

      <v-card-actions class="pt-0 pb-5 px-6">
        <v-spacer />

        <v-btn
          color="grey"
          variant="text"
          :disabled="loading"
          @click="onCancel"
        >
          {{ resolvedCancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          @click="onConfirm"
        >
          {{ resolvedConfirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: string;
    loading?: boolean;
  }>(),
  {
    title: '',
    confirmText: '',
    cancelText: '',
    confirmColor: 'error',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const { t } = useI18n();

const show = computed<boolean>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const resolvedTitle = computed(() => props.title || t('common.confirmation'));
const resolvedCancelText = computed(
  () => props.cancelText || t('common.cancel'),
);
const resolvedConfirmText = computed(
  () => props.confirmText || t('common.confirm'),
);

function onConfirm() {
  emit('confirm');
}

function onCancel() {
  emit('cancel');
  show.value = false;
}
</script>
