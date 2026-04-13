import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type ThemeType = 'light' | 'dark'

export const useGlobalStore = defineStore('global', () => {
  const theme = ref<ThemeType>('light');
  const sidebarOpen = ref<boolean>(true);

  const isDark = computed<boolean>(() => theme.value === 'dark');

  function setTheme(newTheme: ThemeType): void {
    theme.value = newTheme;
  }

  function toggleSidebar(): void {
    sidebarOpen.value = !sidebarOpen.value;
  }

  return {
    theme,
    sidebarOpen,
    isDark,
    setTheme,
    toggleSidebar,
  };
});
