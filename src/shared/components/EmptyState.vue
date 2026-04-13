<template>
  <div class="text-center pa-8">
    <v-icon
      :icon="icon || 'mdi-database-off'"
      color="grey-lighten-1"
      size="x-large"
    />

    <p class="text-h6 mt-4">
      {{ title }}
    </p>

    <p v-if="subtitle" class="text-body-2 text-grey mb-4">
      {{ subtitle }}
    </p>

    <v-btn
      v-if="actionText"
      color="primary"
      variant="outlined"
      @click="$emit('action')"
    >
      <v-icon start>
        {{ actionIcon || 'mdi-plus' }}
      </v-icon>

      {{ actionText }}
    </v-btn>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  icon?: string;
  title: string;
  subtitle?: string;
  actionText?: string;
  actionIcon?: string;
}>();

defineEmits<{
  action: [];
}>();
</script>
