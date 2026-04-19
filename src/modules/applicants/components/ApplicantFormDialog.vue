<template>
  <v-dialog v-model="show" max-width="600" persistent>
    <v-card>
      <v-card-title>{{ title }}</v-card-title>

      <v-card-text>
        <v-form ref="formRef">
          <v-text-field
            v-model="form.fullName"
            :label="$t('applicants.dialogs.editApplicant.labels.fullName')"
            variant="outlined"
            class="mb-4"
            :rules="[validators.required, validators.minLength(3)]"
          />

          <v-mask-input
            v-model="form.phone"
            :label="$t('applicants.dialogs.editApplicant.labels.phone')"
            mask="+7 (###) ###-##-##"
            variant="outlined"
            class="mb-4"
            :rules="[validators.required, validators.phone]"
          />

          <v-select
            v-model="form.status"
            :label="$t('applicants.dialogs.editApplicant.labels.status')"
            :items="statusOptions"
            item-title="title"
            item-value="value"
            variant="outlined"
          />
        </v-form>
      </v-card-text>

      <v-card-actions class="pt-0 pb-5 px-6">
        <v-spacer />

        <v-btn color="grey" variant="text" @click="show = false">
          {{ t('common.cancel') }}
        </v-btn>

        <v-btn color="primary" variant="flat" @click="onSave">
          {{ t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import type { ApplicantFormDataType, IApplicant } from '../types';
import { validators } from '@/shared';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { useApplicantStatuses } from '../composables';

const props = defineProps<{
  modelValue: boolean;
  applicant?: IApplicant | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  save: [data: ApplicantFormDataType];
}>();

const { t } = useI18n();
const { statusOptions } = useApplicantStatuses();

const form = ref<ApplicantFormDataType>({
  fullName: '',
  phone: '',
  status: 'new',
});

const formRef = ref();

const isEditing = computed<boolean>(() => !!props.applicant);

const title = computed(() =>
  isEditing.value
    ? t('applicants.dialogs.editApplicant.editTitle')
    : t('applicants.dialogs.editApplicant.newTitle'),
);

const show = computed<boolean>({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

function resetForm() {
  form.value = { fullName: '', phone: '', status: 'new' };
}

async function onSave(): Promise<void> {
  const { valid } = await formRef.value.validate();

  if (!valid) {
    return;
  }

  emit('save', { ...form.value });
}

watch(show, (value) => {
  if (!value) {
    setTimeout(() => resetForm(), 400);
  }
});

watch(
  () => props.applicant,
  (applicant) => {
    if (applicant) {
      form.value = {
        fullName: applicant.fullName,
        phone: applicant.phone,
        status: applicant.status,
      };
    } else {
      resetForm();
    }
  },
);
</script>
