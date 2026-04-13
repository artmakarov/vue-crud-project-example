import { onUnmounted, ref, type Ref, watch } from 'vue';

export function useDebounce<T>(initialValue: T, delayMs: number = 300) {
  const value = ref<T>(initialValue) as Ref<T>;
  const debouncedValue = ref<T>(initialValue) as Ref<T>;
  let timerId: ReturnType<typeof setTimeout> | null = null;

  watch(value, (newValue: T) => {
    if (timerId) {
      clearTimeout(timerId);
    }

    timerId = setTimeout(() => {
      debouncedValue.value = newValue;
    }, delayMs);
  });

  onUnmounted(() => {
    if (timerId) {
      clearTimeout(timerId);
    }
  });

  return {
    value,
    debouncedValue,
    flush: () => {
      if (timerId) {
        clearTimeout(timerId);
      }

      debouncedValue.value = value.value;
    },
  };
}
