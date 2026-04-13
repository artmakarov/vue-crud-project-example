import { defineStore } from 'pinia';
import { ref } from 'vue';

export type SnackbarColor = 'success' | 'error' | 'info' | 'warning'

export const useSnackbarStore = defineStore('snackbar', () => {
  const text = ref<string>('');
  const color = ref<SnackbarColor>('success');
  const show = ref<boolean>(false);

  let timerId: ReturnType<typeof setTimeout> | null = null;

  function showMessage(message: string, colorType: SnackbarColor = 'success'): void {
    if (timerId) {
      clearTimeout(timerId);
    }

    if (show.value) {
      show.value = false;
      timerId = setTimeout(() => showMessage(message, colorType), 300);
      return;
    }

    text.value = message;
    color.value = colorType;
    show.value = true;

    timerId = setTimeout(() => {
      hideMessage();
    }, 5000);
  }

  function hideMessage(): void {
    if (timerId) {
      clearTimeout(timerId);
      timerId = null;
    }

    show.value = false;
  }

  return {
    text,
    color,
    show,
    showMessage,
    hideMessage,
  };
});
