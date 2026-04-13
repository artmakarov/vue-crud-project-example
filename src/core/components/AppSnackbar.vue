<template>
  <v-snackbar
      v-model="show"
      :color="color"
      :timeout="3000"
      location="top"
  >
    {{ text }}

    <template #actions>
      <v-btn variant="text" size="small" @click="hideMessage">
        Закрыть
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useSnackbarStore } from '../stores';

const snackbar = useSnackbarStore();
const { show, text, color } = storeToRefs(snackbar);
const { hideMessage } = snackbar;
</script>
