<template>
  <v-dialog v-model="show" max-width="400" persistent>
    <v-card>
      <v-card-title>
        {{ title }}
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
          {{ cancelText }}
        </v-btn>

        <v-btn
          :color="confirmColor"
          variant="flat"
          :loading="loading"
          @click="onConfirm"
        >
          {{ confirmText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed } from 'vue';

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
    title: 'Подтверждение',
    confirmText: 'Подтвердить',
    cancelText: 'Отмена',
    confirmColor: 'error',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [];
  cancel: [];
}>();

const show = computed<boolean>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function onConfirm() {
  emit('confirm');
}

function onCancel() {
  emit('cancel');
  show.value = false;
}
</script>
